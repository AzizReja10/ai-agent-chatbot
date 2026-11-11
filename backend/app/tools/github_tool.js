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
  getGitHubRepoInfo,
  getGitHubToken,
  githubRequest,
  listGitHubIssues,
  listIssuesSchema,
  parseRepoIdentifier,
  repoInfoSchema,
};
