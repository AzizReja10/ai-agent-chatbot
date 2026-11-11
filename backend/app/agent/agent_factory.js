const systemPrompt = require("./prompts");
const { getMessages, setMessages } = require("../memory/session_store");
const { getWeather, schema: weatherSchema } = require("../tools/weather_tool");
const { webSearch, schema: webSearchSchema } = require("../tools/web_search_tool");
const {
  getGitHubRepoInfo,
  listGitHubIssues,
  listIssuesSchema,
  repoInfoSchema,
} = require("../tools/github_tool");
const {
  createGoogleTask,
  createGoogleTaskSchema,
  listGoogleTasks,
  listGoogleTasksSchema,
} = require("../tools/tasks_tool");
const {
  createCalendarEvent,
  createCalendarEventSchema,
  listUpcomingEvents,
  listUpcomingEventsSchema,
} = require("../tools/calender_tool");
const {
  appendGoogleDocSchema,
  appendToGoogleDoc,
  readGoogleDocs,
  readGoogleDocsSchema,
} = require("../tools/docs_tool");
const {
  draftEmail,
  draftEmailSchema,
  listRecentEmails,
  listRecentEmailsSchema,
  sendEmail,
} = require("../tools/gmail_tool");
const {
  draftSlackMessage,
  draftSlackSchema,
  listSlackChannels,
  listSlackChannelsSchema,
  sendSlackMessage,
} = require("../tools/slack_tool");
const { handleConfirmedAction, findPendingDraft, isConfirmation } = require("./safe_action_flow");

const tools = [
  [weatherSchema, getWeather],
  [webSearchSchema, webSearch],
  [listIssuesSchema, listGitHubIssues],
  [repoInfoSchema, getGitHubRepoInfo],
  [listGoogleTasksSchema, listGoogleTasks],
  [createGoogleTaskSchema, createGoogleTask],
  [listUpcomingEventsSchema, listUpcomingEvents],
  [createCalendarEventSchema, createCalendarEvent],
  [readGoogleDocsSchema, readGoogleDocs],
  [appendGoogleDocSchema, appendToGoogleDoc],
  [listRecentEmailsSchema, listRecentEmails],
  [draftEmailSchema, draftEmail],
  [draftSlackSchema, draftSlackMessage],
  [listSlackChannelsSchema, listSlackChannels],
];

const toolMap = new Map(tools.map(([definition, execute]) => [definition.function.name, execute]));
const toolSchemas = tools.map(([definition]) => definition);

function toolEvent(onEvent, type, data) {
  onEvent?.({ type, ...data });
}

async function streamCompletion(messages, onEvent) {
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("Set GROQ_API_KEY or OPENROUTER_API_KEY to enable chat.");

  const endpoint = process.env.GROQ_API_KEY
    ? "https://api.groq.com/openai/v1/chat/completions"
    : "https://openrouter.ai/api/v1/chat/completions";
  const model = process.env.GROQ_API_KEY
    ? process.env.GROQ_MODEL || "openai/gpt-oss-20b"
    : process.env.OPENROUTER_MODEL || "openai/gpt-oss-20b";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      tools: toolSchemas,
      tool_choice: "auto",
      stream: true,
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Language model returned ${response.status}: ${body.slice(0, 1000)}`);
  }
  if (!response.body) throw new Error("Language model returned an empty stream.");

  let buffer = "";
  let content = "";
  const toolCalls = [];
  const decoder = new TextDecoder();
  for await (const chunk of response.body) {
    buffer += decoder.decode(chunk, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const value = line.slice(5).trim();
      if (!value || value === "[DONE]") continue;
      let payload;
      try {
        payload = JSON.parse(value);
      } catch {
        continue;
      }
      const delta = payload.choices?.[0]?.delta;
      if (!delta) continue;
      if (typeof delta.content === "string" && delta.content) {
        content += delta.content;
        toolEvent(onEvent, "token", { content: delta.content });
      }
      for (const call of delta.tool_calls || []) {
        const index = call.index;
        if (!toolCalls[index]) {
          toolCalls[index] = {
            id: call.id || "",
            type: "function",
            function: { name: "", arguments: "" },
          };
        }
        if (call.id) toolCalls[index].id = call.id;
        if (call.function?.name) toolCalls[index].function.name += call.function.name;
        if (call.function?.arguments) toolCalls[index].function.arguments += call.function.arguments;
      }
    }
  }
  return { content, toolCalls: toolCalls.filter(Boolean) };
}

async function runAgentStream(threadId, userText, onEvent = () => {}) {
  const messages = [...getMessages(threadId)];
  const pending = findPendingDraft(messages);
  if (pending && isConfirmation(userText)) {
    const result = await handleConfirmedAction(pending);
    messages.push({ role: "user", content: userText }, { role: "assistant", content: result });
    setMessages(threadId, messages);
    toolEvent(onEvent, "token", { content: result });
    toolEvent(onEvent, "done", {});
    return result;
  }

  messages.push({ role: "user", content: userText });
  let finalContent = "";
  for (let round = 0; round < 8; round += 1) {
    const completion = await streamCompletion(messages, onEvent);
    finalContent = completion.content;
    if (!completion.toolCalls.length) {
      messages.push({ role: "assistant", content: finalContent });
      setMessages(threadId, messages);
      toolEvent(onEvent, "done", {});
      return finalContent;
    }

    messages.push({
      role: "assistant",
      content: completion.content || null,
      tool_calls: completion.toolCalls,
    });
    for (const call of completion.toolCalls) {
      const name = call.function.name;
      const execute = toolMap.get(name);
      let args;
      let result;
      try {
        args = JSON.parse(call.function.arguments || "{}");
        if (!execute) throw new Error(`Unknown tool: ${name}`);
        toolEvent(onEvent, "tool_start", { name, args });
        result = await execute(args);
      } catch (error) {
        result = `Tool ${name} failed: ${error.message}`;
      }
      toolEvent(onEvent, "tool_end", { name, data: result });
      if (name === "draft_email" || name === "draft_slack_message") {
        call.function.arguments = JSON.stringify(args);
      }
      messages.push({
        role: "tool",
        tool_call_id: call.id,
        name,
        content: String(result),
      });
    }
  }
  throw new Error("Agent exceeded the maximum number of tool-call rounds.");
}

async function runAgentTurn(threadId, userText) {
  let reply = "";
  await runAgentStream(threadId, userText, (event) => {
    if (event.type === "token") reply += event.content;
  });
  return reply;
}

function cancelPendingAction(threadId) {
  const messages = [...getMessages(threadId)];
  if (!findPendingDraft(messages)) return false;
  messages.push(
    { role: "user", content: "cancel" },
    { role: "assistant", content: "Action cancelled. I did not send it." },
  );
  setMessages(threadId, messages);
  return true;
}

function buildAgent() {
  return { cancelPendingAction, runAgentStream, runAgentTurn };
}

module.exports = { buildAgent, cancelPendingAction, runAgentStream, runAgentTurn, toolSchemas };
