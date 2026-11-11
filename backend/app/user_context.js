const { AsyncLocalStorage } = require("node:async_hooks");

const userContext = new AsyncLocalStorage();

function currentUserId() {
  const context = userContext.getStore();
  if (!context) throw new Error("No user context set");
  return context.userId;
}

module.exports = { currentUserId, userContext };
