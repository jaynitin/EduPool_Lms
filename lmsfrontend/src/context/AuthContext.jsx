// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);
const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === "true";

// Fake user for local styling — swap the role to test both dashboards
const MOCK_USER = { username: "jay", role: "INSTRUCTOR" }; // or 'STUDENT'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(USE_MOCK ? MOCK_USER : null);
  const [loading, setLoading] = useState(!USE_MOCK);

  useEffect(() => {
    if (!USE_MOCK) checkSession();
  }, []);

  async function checkSession() {
    try {
      const res = await axiosClient.get("/users/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // AFTER
  async function login(email, password, role) {
    if (USE_MOCK) {
      const mockUser = { email, role };
      setUser(mockUser);
      return mockUser;
    }
    const res = await axiosClient.post("/users/login", { email, password });
    setUser(res.data); // { name, email, role }
    return res.data;
  }

  async function register(userData) {
    if (USE_MOCK) {
      const mockUser = { ...userData };
      setUser(mockUser);
      return mockUser;
    }
    const res = await axiosClient.post("/users/reg", userData);
    setUser(res.data);
    return res.data;
  }

  async function logout() {
    if (USE_MOCK) {
      setUser(null);
      return;
    }
    // Backend exposes this as GET, not POST
    await axiosClient.get("/users/logout");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
