const { googleApi } = require("./google_auth");

const readGoogleDocsSchema = {
  type: "function",
  function: {
    name: "read_google_docs",
    description:
      "Find a Google Doc by title and return its full text. Fetch it before answering about a named document.",
    parameters: {
      type: "object",
      properties: { doc_name: { type: "string" } },
      required: ["doc_name"],
      additionalProperties: false,
    },
  },
};

const appendGoogleDocSchema = {
  type: "function",
  function: {
    name: "append_to_google_doc",
    description: "Append text to an existing Google Doc found by title.",
    parameters: {
      type: "object",
      properties: {
        doc_name: { type: "string" },
        text: { type: "string" },
      },
      required: ["doc_name", "text"],
      additionalProperties: false,
    },
  },
};

function extractText(document) {
  const elements = document.body?.content || [];
  return elements
    .flatMap((item) => item.paragraph?.elements || [])
    .map((element) => element.textRun?.content?.replace(/\n/g, " ") || "")
    .join("");
}

async function findDocument(docName) {
  const query = `name = '${docName.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.document' and trashed = false`;
  const url = new URL("https://www.googleapis.com/drive/v3/files");
  url.search = new URLSearchParams({ q: query, fields: "files(id,name)", pageSize: "10" });
  const result = await googleApi(url);
  return result.files?.[0] || null;
}

async function readGoogleDocs({ doc_name }) {
  try {
    const file = await findDocument(doc_name);
    if (!file) return `No google doc found with the name '${doc_name}'`;
    const document = await googleApi(
      `https://docs.googleapis.com/v1/documents/${encodeURIComponent(file.id)}`,
    );
    const text = extractText(document);
    return text.trim() ? text : `the document '${doc_name}' appears to be empty.`;
  } catch (error) {
    return error.message;
  }
}

async function appendToGoogleDoc({ doc_name, text }) {
  try {
    const file = await findDocument(doc_name);
    if (!file) return `No Google Doc found with the name '${doc_name}'.`;
    const document = await googleApi(
      `https://docs.googleapis.com/v1/documents/${encodeURIComponent(file.id)}`,
    );
    const content = document.body?.content || [];
    const endIndex = (content.at(-1)?.endIndex || 1) - 1;
    await googleApi(
      `https://docs.googleapis.com/v1/documents/${encodeURIComponent(file.id)}:batchUpdate`,
      {
        method: "POST",
        body: JSON.stringify({
          requests: [{ insertText: { location: { index: endIndex }, text: `\n${text}` } }],
        }),
      },
    );
    return `Appended text to '${doc_name}'.`;
  } catch (error) {
    return `Failed to update document: ${error.message}`;
  }
}

module.exports = {
  appendGoogleDocSchema,
  appendToGoogleDoc,
  extractText,
  readGoogleDocs,
  readGoogleDocsSchema,
};
