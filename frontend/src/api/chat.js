// src/api/chat.js
export async function streamChat(threadId, message, handlers) {
  const response = await fetch("http://127.0.0.1:8000/chat/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ thread_id: threadId, message }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const event = JSON.parse(line.slice(6));

      if (event.type === "token") handlers.onToken(event.content);
      if (event.type === "tool_start") handlers.onToolStart(event.name, event.args);
      if (event.type === "tool_end") handlers.onToolEnd(event.name);
      if (event.type === "done") { handlers.onDone(); return; }
    }
  }
}