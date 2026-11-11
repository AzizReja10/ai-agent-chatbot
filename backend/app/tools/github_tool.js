const { currentUserId } = require("../user_context");
const { get } = require("../db");

const listIssuesSchema = {
  type: "function",
  function: {
    name: "list_github_issues",
    description: "Fetch open issues for a GitHub repository.",
    parameters: {
      type: "object",
      properties: {
        owner: { type: "string", description: "Repository owner" },
        repo: { type: "string", description: "Repository name" },
      },
      required: ["owner", "repo"],
      additionalProperties: false,
    },
  },
};

const repoInfoSchema = {
  type: "function",
  function: {
    name: "get_github_repo_info",
    description: "Get a GitHub repository's description, language, stars, and topics.",
    parameters: {
      type: "object",
      properties: { repo: { type: "string", description: "owner/repo or GitHub URL" } },
      required: ["repo"],
      additionalProperties: false,
    },
  },
};

const getGitHubProfileSchema = {
  type: "function",
  function: {
    name: "get_github_profile",
    description:
      "Get the signed-in user's GitHub username, display name, and verified primary email. Use this when they ask about their GitHub account or email.",
    parameters: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
};

const listGitHubRepositoriesSchema = {
  type: "function",
  function: {
    name: "list_github_repositories",
    description:
      "List the signed-in user's recently pushed GitHub repositories. Use this when they refer to their repository but do not give its name.",
    parameters: {
      type: "object",
      properties: {
        max_results: { type: "integer", minimum: 1, maximum: 30 },
      },
      additionalProperties: false,
    },
  },
};

const listMyRecentGitHubIssuesSchema = {
  type: "function",
  function: {
    name: "list_my_recent_github_issues",
    description:
      "Find recent open issues across the signed-in user's recently pushed GitHub repositories. Use this when they ask for issues in 'my repository' without naming a repository; include each repository name in the results.",
    parameters: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
};

function formatGitHubProfile(profile, email) {
  const details = [];
  if (profile.name) details.push(`Name: ${profile.name}`);
  if (profile.login) details.push(`Username: @${profile.login}`);
  if (email) details.push(`Email: ${email}`);
  return details.length
    ? details.join("\n")
    : "GitHub did not return a name, username, or verified email for this account.";
}

async function getVerifiedPrimaryEmail(fallbackEmail = null) {
  const response = await githubRequest("https://api.github.com/user/emails");
  if (!response.ok) return fallbackEmail;
  const emails = await response.json();
  return emails.find((item) => item.primary && item.verified)?.email || fallbackEmail;
}

async function getGitHubProfile() {
  try {
    const response = await githubRequest("https://api.github.com/user");
    if (!response.ok) {
      return `Could not retrieve your GitHub profile: GitHub API returned ${response.status}.`;
    }
    const profile = await response.json();
    const email = await getVerifiedPrimaryEmail(profile.email);
    return formatGitHubProfile(profile, email);
  } catch (error) {
    return `Could not retrieve your GitHub profile: ${error.message}`;
  }
}

async function listGitHubRepositories({ max_results = 20 } = {}) {
  try {
    const limit = Math.max(1, Math.min(30, Number(max_results) || 20));
    const url = new URL("https://api.github.com/user/repos");
    url.search = new URLSearchParams({
      sort: "pushed",
      direction: "desc",
      per_page: String(limit),
      affiliation: "owner,collaborator,organization",
    });
    const response = await githubRequest(url);
    if (!response.ok) {
      return `Could not list your GitHub repositories: GitHub API returned ${response.status}.`;
    }
    const repositories = await response.json();
    return repositories.length
      ? repositories
          .map((repository) =>
            `${repository.full_name}${repository.private ? " (private)" : ""}${repository.description ? ` — ${repository.description}` : ""}`,
          )
          .join("\n")
      : "No GitHub repositories were found for this account.";
  } catch (error) {
    return `Could not list your GitHub repositories: ${error.message}`;
  }
}

async function listMyRecentGitHubIssues() {
  try {
    const repositoriesResponse = await githubRequest(
      "https://api.github.com/user/repos?sort=pushed&direction=desc&per_page=10&affiliation=owner,collaborator,organization",
    );
    if (!repositoriesResponse.ok) {
      return `Could not list your GitHub repositories: GitHub API returned ${repositoriesResponse.status}.`;
    }
    const repositories = await repositoriesResponse.json();
    if (!repositories.length) return "No GitHub repositories were found for this account.";

    const issueResults = await Promise.all(
      repositories.map(async (repository) => {
        const response = await githubRequest(
          `https://api.github.com/repos/${encodeURIComponent(repository.owner.login)}/${encodeURIComponent(repository.name)}/issues?state=open&sort=updated&direction=desc&per_page=5`,
        );
        if (!response.ok) return [];
        const issues = await response.json();
        return issues
          .filter((issue) => !issue.pull_request)
          .map((issue) => ({
            repository: repository.full_name,
            number: issue.number,
            title: issue.title,
            updatedAt: issue.updated_at,
            url: issue.html_url,
          }));
      }),
    );
    const issues = issueResults
      .flat()
      .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
      .slice(0, 20);
    return issues.length
      ? issues
          .map((issue) => `${issue.repository} #${issue.number}: ${issue.title}\n${issue.url}`)
          .join("\n")
      : `No open issues found in your ${repositories.length} most recently pushed repositories.`;
  } catch (error) {
    return `Could not retrieve your recent GitHub issues: ${error.message}`;
  }
}

function parseRepoIdentifier(repo) {
  const value = repo.trim();
  if (/^https?:\/\//i.test(value)) {
    const url = new URL(value);
    const parts = url.pathname.split("/").filter(Boolean);
    if (url.hostname !== "github.com" || parts.length < 2) {
      throw new Error("Could not parse owner/repo from that URL.");
    }
    return [parts[0], parts[1].replace(/\.git$/i, "")];
  }
  const parts = value.split("/");
  if (parts.length >= 2 && parts[0] && parts[1]) return [parts[0], parts[1]];
  throw new Error("Provide either 'owner/repo' or a full GitHub URL.");
}

async function getGitHubToken() {
  const userId = currentUserId();
  const record = await get(
    "SELECT access_token FROM github_credentials WHERE user_id = ?",
    [userId],
  );
  if (!record) {
    throw new Error("You haven't connected your GitHub account yet. Please connect it to use this feature.");
  }
  return record.access_token;
}

async function githubRequest(url) {
  const token = await getGitHubToken();
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
}

async function listGitHubIssues({ owner, repo }) {
  try {
    const response = await githubRequest(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues?state=open`,
    );
    if (response.status === 404) return `No repository found at ${owner}/${repo}. Check the owner and repo name.`;
    if (response.status === 401) return "GitHub authentication failed — your connected account may need to be reconnected.";
    if (!response.ok) return `GitHub API returned an unexpected error: ${response.status}`;
    const issues = await response.json();
    const openIssues = issues.filter((issue) => !issue.pull_request);
    return openIssues.length
      ? openIssues.map((issue) => `#${issue.number}: ${issue.title}`).join("\n")
      : `No open issues found in ${owner}/${repo}.`;
  } catch (error) {
    return `GitHub request failed: ${error.message}`;
  }
}

async function getGitHubRepoInfo({ repo }) {
  let owner;
  let name;
  try {
    [owner, name] = parseRepoIdentifier(repo);
    const response = await githubRequest(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`,
    );
    if (response.status === 404) return `No repository found at ${owner}/${name}.`;
    if (!response.ok) return `GitHub API returned an unexpected error: ${response.status}`;
    const data = await response.json();
    return `Repo: ${owner}/${name}\nDescription: ${data.description || "(no description provided)"}\nPrimary language: ${data.language || "unknown"}\nStars: ${data.stargazers_count || 0}\nTopics: ${data.topics?.join(", ") || "none"}`;
  } catch (error) {
    return `GitHub request failed: ${error.message}`;
  }
}

module.exports = {
  formatGitHubProfile,
  getGitHubProfile,
  getGitHubProfileSchema,
  getGitHubRepoInfo,
  getGitHubToken,
  getVerifiedPrimaryEmail,
  githubRequest,
  listGitHubIssues,
  listGitHubRepositories,
  listGitHubRepositoriesSchema,
  listIssuesSchema,
  listMyRecentGitHubIssues,
  listMyRecentGitHubIssuesSchema,
  parseRepoIdentifier,
  repoInfoSchema,
};
