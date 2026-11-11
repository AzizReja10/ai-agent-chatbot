// src/api/chat.js
export async function streamChat(message, threadId, handlers) {
  const response = await fetch("/chat/stream", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, thread_id: threadId }),
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const error = await response.json();
      message = error.detail || message;
    } catch {
      // The response body was not JSON.
    }
    throw new Error(message);
  }
  if (!response.body) throw new Error("The server did not return a response stream.");

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
      let event;
      try {
        event = JSON.parse(line.slice(6));
      } catch {
        // Skip malformed chunks
        continue;
      }
      if (event.type === "error") throw new Error(event.message || "Chat request failed.");
      if (event.type === "token") handlers.onToken?.(event.content);
      if (event.type === "tool_start") handlers.onToolStart?.(event.name, event.args);
      if (event.type === "tool_end") handlers.onToolEnd?.(event.name, event.data);
      if (event.type === "done") {
        handlers.onDone?.();
        return;
      }
    }
  }
}

export async function cancelPendingAction() {
  const response = await fetch("/chat/cancel", {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const error = await response.json();
      message = error.detail || message;
    } catch {
      // The response body was not JSON.
    }
    throw new Error(message);
  }
  return response.json();
}
