// src/api/auth.js
async function request(path, body) {
  const response = await fetch(path, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    let errMessage = "Request failed";
    try {
      const err = await response.json();
      errMessage = err.detail || errMessage;
    } catch {
      // response body was not JSON
    }
    throw new Error(errMessage);
  }
  return response.json();
}

export const signup = (email, password) => request("/auth/signup", { email, password });
export const login = (email, password) => request("/auth/login", { email, password });

export async function getCurrentUser() {
  try {
    const response = await fetch("/auth/me", { credentials: "include" });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function logout() {
  try {
    await fetch("/auth/logout", { method: "POST", credentials: "include" });
  } catch {
    // ignore network errors on logout
  }
}

export async function getGoogleStatus() {
  try {
    const response = await fetch("/auth/google/status", { credentials: "include" });
    if (!response.ok) return { connected: false };
    return await response.json();
  } catch {
    return { connected: false };
  }
}

export async function finalizeGoogleSignin(token) {
  try {
    const response = await fetch(`/auth/google/finalize?token=${encodeURIComponent(token)}`, {
      method: "POST",
      credentials: "include",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getGitHubStatus() {
  try {
    const response = await fetch("/auth/github/status", { credentials: "include" });
    if (!response.ok) return { connected: false };
    return await response.json();
  } catch {
    return { connected: false };
  }
}

export async function finalizeSignin(token) {
  try {
    const response = await fetch(`/auth/finalize?token=${encodeURIComponent(token)}`, {
      method: "POST",
      credentials: "include",
    });
    return response.ok;
  } catch {
    return false;
  }
}
