// src/api/auth.js
async function request(path, body) {
  const response = await fetch(path, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Request failed");
  }
  return response.json();
}

export const signup = (email, password) => request("/auth/signup", { email, password });
export const login = (email, password) => request("/auth/login", { email, password });

export async function getCurrentUser() {
  const response = await fetch("/auth/me", { credentials: "include" });
  if (!response.ok) return null;
  return response.json();
}
export async function logout() {
  await fetch("/auth/logout", { method: "POST", credentials: "include" });
}
export async function getGoogleStatus() {
  const response = await fetch("/auth/google/status", { credentials: "include" });
  if (!response.ok) return { connected: false };
  return response.json();
}
export async function finalizeGoogleSignin(token) {
  const response = await fetch(`/auth/google/finalize?token=${encodeURIComponent(token)}`, {
    method: "POST",
    credentials: "include",
  });
  return response.ok;
}