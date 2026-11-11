const sessions = new Map();

function getMessages(threadId) {
  return sessions.get(threadId) || [];
}

function setMessages(threadId, messages) {
  sessions.set(threadId, messages);
}

module.exports = { getMessages, setMessages };
