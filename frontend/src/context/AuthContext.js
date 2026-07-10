// src/context/AuthContext.js
// Drop-in replacement for localStorage-based authUtils.
// Wraps the app and provides: user, login, logout, updateUser, loading.

import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshSession,
  updateProfile,
} from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until session restored

  // ─── Restore session on app load ────────────────────────────
  useEffect(() => {
    const restore = async () => {
      try {
        const currentUser = await refreshSession();
        if (currentUser) setUser(currentUser);
      } catch {
        // No active session — fine
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  // ─── Register ────────────────────────────────────────────────
  const register = async (data) => {
    const newUser = await registerUser(data);
    setUser(newUser);
    return newUser;
  };

  // ─── Login ───────────────────────────────────────────────────
  const login = async (credentials) => {
    const loggedIn = await loginUser(credentials);
    setUser(loggedIn);
    return loggedIn;
  };

  // ─── Logout ──────────────────────────────────────────────────
  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  // ─── Update profile ──────────────────────────────────────────
  const updateUser = async (data) => {
    const updated = await updateProfile(data);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for easy consumption
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
