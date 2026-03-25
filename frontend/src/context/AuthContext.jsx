import React, { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, logout as apiLogout, me as apiMe, register as apiRegister } from "../api/client.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // /auth/me returns the user object directly, not { user: ... }
        const data = await apiMe();
        // Backend /auth/me returns user object directly, not wrapped
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const login = async (payload) => {
    const data = await apiLogin(payload);
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const data = await apiRegister(payload);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      // Ignore logout errors
    }
    localStorage.removeItem('token');
    setUser(null);
    // Redirect to login page
    window.location.href = '/login';
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

