const assert = require("node:assert/strict");
const { toolSchemas } = require("./app/agent/agent_factory");

const exposedTools = new Set(toolSchemas.map((tool) => tool.function.name));
assert(exposedTools.has("draft_email"));
assert(exposedTools.has("draft_slack_message"));
assert(!exposedTools.has("send_email"));
assert(!exposedTools.has("send_slack_message"));
console.log(`Agent initialized with ${exposedTools.size} tools; direct send actions are not exposed.`);
