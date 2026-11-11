const { sendEmail } = require("../tools/gmail_tool");
const { sendSlackMessage } = require("../tools/slack_tool");

const draftToAction = {
  draft_email: sendEmail,
  draft_slack_message: sendSlackMessage,
};

function isConfirmation(text) {
  const value = text.toLowerCase().trim().replace(/[.!?]+$/, "");
  if (/\b(no|not|don't|do not|cancel|stop|never)\b/.test(value)) return false;
  return /^(yes|yep|yeah|sure|confirm(?:ed)?|go ahead|please go ahead|do it|please do it|send it|please send it)(?:\b|[,])/i.test(value);
}

function findPendingDraft(messages) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const calls = messages[i].tool_calls || [];
    for (const call of calls) {
      if (draftToAction[call.function?.name]) {
        if (messages.slice(i + 1).some((message) => message.role === "user")) return null;
        try {
          return {
            name: call.function.name,
            args: JSON.parse(call.function.arguments || "{}"),
          };
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

async function handleConfirmedAction(pending) {
  const action = draftToAction[pending.name];
  if (!action) throw new Error(`Unsupported confirmation action: ${pending.name}`);
  return action(pending.args);
}

module.exports = {
  draftToAction,
  findPendingDraft,
  handleConfirmedAction,
  isConfirmation,
};
