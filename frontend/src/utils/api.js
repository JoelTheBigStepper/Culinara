// src/utils/api.js
// All requests go to the Express backend.
// Access token is kept in memory (not localStorage) for security.
// Refresh token is in an httpOnly cookie — handled automatically by the browser.

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// ─── In-memory access token store ────────────────────────────
// Never put the access token in localStorage — XSS risk.
let _accessToken = null;

export const setAccessToken = (token) => {
  _accessToken = token;
};

export const getAccessToken = () => _accessToken;

export const clearAccessToken = () => {
  _accessToken = null;
};

// ─── Core fetch wrapper with auto-refresh ─────────────────────
let isRefreshing = false;
let refreshQueue = []; // queued requests waiting for new token

const processQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  refreshQueue = [];
};

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const makeRequest = (token) =>
    fetch(url, {
      ...options,
      credentials: "include", // send httpOnly refresh token cookie
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

  let res = await makeRequest(_accessToken);

  // ─── Auto-refresh on 401 with expired: true ───────────────
  if (res.status === 401) {
    const body = await res.clone().json().catch(() => ({}));

    if (body.expired) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((newToken) => makeRequest(newToken));
      }

      isRefreshing = true;

      try {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (!refreshRes.ok) throw new Error("Refresh failed");

        const { accessToken } = await refreshRes.json();
        setAccessToken(accessToken);
        processQueue(null, accessToken);

        return makeRequest(accessToken);
      } catch (err) {
        processQueue(err, null);
        clearAccessToken();
        // Redirect to sign in
        window.location.href = "/signin";
        throw err;
      } finally {
        isRefreshing = false;
      }
    }
  }

  return res;
};

// ─── Convenience helpers ──────────────────────────────────────
const json = async (res) => {
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  } catch (err) {
    if (!res.ok) throw new Error("Request failed");
    throw err;
  }
};

// ─── AUTH ─────────────────────────────────────────────────────
export const registerUser = async ({ name, email, password, avatar }) => {
  const res = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, avatar }),
  });
  const data = await json(res);
  setAccessToken(data.accessToken);
  return data.user;
};

export const loginUser = async ({ email, password }) => {
  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const data = await json(res);
  setAccessToken(data.accessToken);
  return data.user;
};

export const logoutUser = async () => {
  await apiFetch("/auth/logout", { method: "POST" });
  clearAccessToken();
};

export const refreshSession = async () => {
  // Called once on app load to restore session from httpOnly cookie
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) return null;
  const { accessToken } = await res.json();
  setAccessToken(accessToken);

  // Fetch current user
  const meRes = await apiFetch("/auth/me");
  if (!meRes.ok) return null;
  return meRes.json();
};

// ─── RECIPES ──────────────────────────────────────────────────
export const getAllRecipes = async () => {
  const res = await apiFetch("/recipes");
  return json(res);
};

export const getRecipeById = async (id) => {
  const res = await apiFetch(`/recipes/${id}`);
  return json(res);
};

export const addRecipe = async (data) => {
  const res = await apiFetch("/recipes", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return json(res);
};

export const updateRecipe = async (id, data) => {
  const res = await apiFetch(`/recipes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return json(res);
};

export const deleteRecipe = async (id) => {
  const res = await apiFetch(`/recipes/${id}`, { method: "DELETE" });
  return json(res);
};

export const getMyRecipes = async () => {
  const res = await apiFetch("/recipes/mine");
  return json(res);
};

// ─── FAVORITES ────────────────────────────────────────────────
export const getFavorites = async () => {
  const res = await apiFetch("/users/favorites/all");
  return json(res);
};

export const getFavoriteIds = async () => {
  const res = await apiFetch("/users/favorites/ids");
  return json(res);
};

export const toggleFavorite = async (recipeId) => {
  const res = await apiFetch("/users/favorites/toggle", {
    method: "POST",
    body: JSON.stringify({ recipeId }),
  });
  return json(res);
};

// ─── USER ─────────────────────────────────────────────────────
export const updateProfile = async ({ name, avatar, password }) => {
  const res = await apiFetch("/users/profile", {
    method: "PUT",
    body: JSON.stringify({ name, avatar, password }),
  });
  return json(res);
};