import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext(null);

const USER_KEY = "qs_user";
const TOKEN_KEY = "qs_token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem(USER_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem("token", token); // compatibility with older code
      api.setToken(token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("token");
      api.setToken(null);
    }
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  const login = (data) => {
    if (!data?.token || !data?.user) {
      throw new Error("Invalid auth response: expected { user, token }");
    }
    setUser(data.user);
    setToken(data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx) return ctx;
  // Prevent "Cannot destructure ... as it is null" crashes if provider is miswired
  return {
    user: null,
    login: () => {
      throw new Error("AuthProvider is missing. Wrap your app with <AuthProvider>.");
    },
    logout: () => {},
  };
};

