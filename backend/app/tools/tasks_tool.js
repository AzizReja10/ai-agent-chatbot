const { googleApi } = require("./google_auth");

const listGoogleTasksSchema = {
  type: "function",
  function: {
    name: "list_google_tasks",
    description: "List the user's pending tasks from their default Google Tasks list.",
    parameters: { type: "object", properties: {}, additionalProperties: false },
  },
};

const createGoogleTaskSchema = {
  type: "function",
  function: {
    name: "create_google_task",
    description:
      "Create a Google Task. Use when the user asks to add, create, or remember a to-do item.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string" },
        notes: { type: "string" },
        due: { type: "string", description: "Optional RFC 3339 due date" },
      },
      required: ["title"],
      additionalProperties: false,
    },
  },
};

async function listGoogleTasks() {
  try {
    const result = await googleApi(
      "https://tasks.googleapis.com/tasks/v1/lists/@default/tasks?showCompleted=false&showHidden=false",
    );
    return result.items?.length
      ? result.items.map((task) => `- ${task.title || "(untitled)"} [${task.status || "unknown"}]`).join("\n")
      : "no pending tasks found.";
  } catch (error) {
    return error.message;
  }
}

async function createGoogleTask({ title, notes = "", due = "" }) {
  try {
    const body = { title, notes };
    if (due) body.due = due;
    await googleApi("https://tasks.googleapis.com/tasks/v1/lists/@default/tasks", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return `Task '${title}' created.`;
  } catch (error) {
    return `Failed to create task: ${error.message}`;
  }
}

module.exports = {
  createGoogleTask,
  createGoogleTaskSchema,
  listGoogleTasks,
  listGoogleTasksSchema,
};
