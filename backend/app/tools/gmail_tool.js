const { googleApi } = require("./google_auth");

const listRecentEmailsSchema = {
  type: "function",
  function: {
    name: "list_recent_emails",
    description: "List recent Gmail inbox messages with sender and subject.",
    parameters: {
      type: "object",
      properties: { max_results: { type: "integer", minimum: 1, maximum: 20 } },
      additionalProperties: false,
    },
  },
};

const draftEmailSchema = {
  type: "function",
  function: {
    name: "draft_email",
    description: "Prepare an email draft for the user to review. This does not send anything.",
    parameters: {
      type: "object",
      properties: {
        to: { type: "string" },
        subject: { type: "string" },
        body: { type: "string" },
      },
      required: ["to", "subject", "body"],
      additionalProperties: false,
    },
  },
};

async function listRecentEmails({ max_results = 5 } = {}) {
  try {
    const url = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages");
    url.search = new URLSearchParams({ maxResults: String(Math.max(1, Math.min(20, max_results))) });
    const result = await googleApi(url);
    if (!result.messages?.length) return " no recent emails found.";
    const lines = [];
    for (const message of result.messages) {
      const data = await googleApi(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(message.id)}?format=metadata&metadataHeaders=From&metadataHeaders=Subject`,
      );
      const headers = data.payload?.headers || [];
      const sender = headers.find((header) => header.name.toLowerCase() === "from")?.value || "Unknown Sender";
      const subject = headers.find((header) => header.name.toLowerCase() === "subject")?.value || "(no subject)";
      lines.push(`From: ${sender} | Subject: ${subject}`);
    }
    return lines.join("\n");
  } catch (error) {
    return error.message;
  }
}

function draftEmail({ to, subject, body }) {
  return `Here is the drafted email:\nTo: ${to}\nSubject: ${subject}\nBody: ${body}\n\nShould I send this?`;
}

async function sendEmail({ to, subject, body }) {
  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    body,
  ].join("\r\n");
  const raw = Buffer.from(message, "utf8").toString("base64url");
  try {
    await googleApi("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      body: JSON.stringify({ raw }),
    });
    return `Email sent to ${to}.`;
  } catch (error) {
    return `Failed to send email: ${error.message}`;
  }
}

module.exports = {
  draftEmail,
  draftEmailSchema,
  listRecentEmails,
  listRecentEmailsSchema,
  sendEmail,
};
