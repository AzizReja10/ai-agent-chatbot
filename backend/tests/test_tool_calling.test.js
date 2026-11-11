const test = require("node:test");
const assert = require("node:assert/strict");
const { cancelPendingAction, toolSchemas } = require("../app/agent/agent_factory");
const { findPendingDraft, isConfirmation } = require("../app/agent/safe_action_flow");
const { getMessages, setMessages } = require("../app/memory/session_store");
const { extractText } = require("../app/tools/docs_tool");
const {
  formatGitHubProfile,
  parseRepoIdentifier,
} = require("../app/tools/github_tool");
const { mergeGoogleTokens } = require("../app/google_oauth_routes");
const githubOAuthRouter = require("../app/github_oauth_routes");

test("agent exposes the available tools but not irreversible send actions", () => {
  const names = toolSchemas.map((tool) => tool.function.name);
  assert.ok(names.includes("draft_email"));
  assert.ok(names.includes("draft_slack_message"));
  assert.ok(names.includes("get_google_profile"));
  assert.ok(names.includes("get_github_profile"));
  assert.ok(names.includes("list_github_repositories"));
  assert.ok(names.includes("list_my_recent_github_issues"));
  assert.ok(!names.includes("send_email"));
  assert.ok(!names.includes("send_slack_message"));
});

test("only explicit confirmation phrases activate the safety gate", () => {
  assert.equal(isConfirmation("Yes, send it"), true);
  assert.equal(isConfirmation("please go ahead"), true);
  assert.equal(isConfirmation("please send it"), true);
  assert.equal(isConfirmation("not yet"), false);
  assert.equal(isConfirmation("yesterday, do not send it"), false);
  assert.equal(isConfirmation("yes, don't send it"), false);
});

test("a draft can be confirmed only once", () => {
  const draft = {
    role: "assistant",
    tool_calls: [{
      id: "call_1",
      function: { name: "draft_email", arguments: '{"to":"a@example.com","subject":"Hi","body":"Hello"}' },
    }],
  };
  assert.deepEqual(findPendingDraft([draft]), {
    name: "draft_email",
    args: { to: "a@example.com", subject: "Hi", body: "Hello" },
  });
  assert.equal(findPendingDraft([draft, { role: "user", content: "Yes, send it" }]), null);
});

test("cancelling a draft records the cancellation and consumes the pending action", () => {
  const threadId = "cancel-test";
  setMessages(threadId, [{
    role: "assistant",
    tool_calls: [{
      id: "call_2",
      function: { name: "draft_slack_message", arguments: '{"channel":"general","text":"Hello"}' },
    }],
  }]);
  assert.equal(cancelPendingAction(threadId), true);
  assert.equal(findPendingDraft(getMessages(threadId)), null);
});

test("GitHub repository names and URLs are parsed", () => {
  assert.deepEqual(parseRepoIdentifier("octocat/hello-world"), ["octocat", "hello-world"]);
  assert.deepEqual(parseRepoIdentifier("https://github.com/octocat/hello-world"), ["octocat", "hello-world"]);
});

test("GitHub profile output includes the user's account identity", () => {
  assert.equal(
    formatGitHubProfile(
      { name: "Ada Lovelace", login: "ada" },
      "ada@example.com",
    ),
    "Name: Ada Lovelace\nUsername: @ada\nEmail: ada@example.com",
  );
});

test("GitHub OAuth sign-in requests profile, email, and repository access", () => {
  assert.deepEqual(githubOAuthRouter.signInScopes, ["read:user", "user:email", "repo"]);
});

test("Google Docs paragraph content is extracted", () => {
  assert.equal(
    extractText({
      body: {
        content: [{
          paragraph: {
            elements: [{ textRun: { content: "Hello\n" } }, { textRun: { content: "world" } }],
          },
        }],
      },
    }),
    "Hello world",
  );
});

test("Google reconnect preserves an existing refresh token when Google omits a new one", () => {
  assert.deepEqual(
    mergeGoogleTokens(
      { access_token: "old-access", refresh_token: "long-lived-refresh" },
      { access_token: "new-access", expiry_date: 1234 },
    ),
    {
      access_token: "new-access",
      refresh_token: "long-lived-refresh",
      expiry_date: 1234,
    },
  );
});
