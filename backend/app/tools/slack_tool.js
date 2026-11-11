const { slackBotToken } = require("../config");

const listSlackChannelsSchema = {
  type: "function",
  function: {
    name: "list_slack_channels",
    description: "List Slack channels accessible to the configured bot.",
    parameters: { type: "object", properties: {}, additionalProperties: false },
  },
};

const draftSlackSchema = {
  type: "function",
  function: {
    name: "draft_slack_message",
    description: "Prepare a Slack message for review. This does not send anything.",
    parameters: {
      type: "object",
      properties: {
        channel: { type: "string" },
        text: { type: "string" },
      },
      required: ["channel", "text"],
      additionalProperties: false,
    },
  },
};

async function slackRequest(method, payload = {}) {
  if (!slackBotToken) throw new Error("Slack is not configured (SLACK_BOT_TOKEN is missing).");
  const response = await fetch(`https://slack.com/api/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${slackBotToken}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error(data.error || `Slack API returned ${response.status}`);
  return data;
}

async function listSlackChannels() {
  try {
    const response = await slackRequest("conversations.list", { limit: 200 });
    return response.channels?.length
      ? response.channels.map((channel) => `#${channel.name}`).join("\n")
      : "No channels found.";
  } catch (error) {
    return `Slack API error: ${error.message}`;
  }
}

function draftSlackMessage({ channel, text }) {
  return `Here is the drafted Slack message:\nChannel: #${channel}\nMessage: ${text}\n\nShould I send this?`;
}

async function sendSlackMessage({ channel, text }) {
  try {
    await slackRequest("chat.postMessage", { channel, text });
    return `Message sent to #${channel}`;
  } catch (error) {
    return `Slack API error: ${error.message}`;
  }
}

module.exports = {
  draftSlackMessage,
  draftSlackSchema,
  listSlackChannels,
  listSlackChannelsSchema,
  sendSlackMessage,
};
