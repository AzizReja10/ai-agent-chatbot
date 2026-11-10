// src/api/chat.js
export async function streamChat(message, threadId, handlers) {
  const response = await fetch("/chat/stream", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, thread_id: threadId }),
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
      try {
        const event = JSON.parse(line.slice(6));

        if (event.type === "token") handlers.onToken?.(event.content);
        if (event.type === "tool_start") handlers.onToolStart?.(event.name, event.args);
        if (event.type === "tool_end") handlers.onToolEnd?.(event.name, event.data);
        if (event.type === "done") {
          handlers.onDone?.();
          return;
        }
      } catch {
        // Skip malformed chunks
      }
    }
  }
}
