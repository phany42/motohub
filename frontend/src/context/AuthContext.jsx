import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, loginUser, logoutUser, setApiAuthToken } from "../services/apiClient";

const AUTH_STORAGE_KEY = "motohub_auth";
const AuthContext = createContext(null);

function readPersistedAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return { token: "", user: null };
    }

    const parsed = JSON.parse(raw);
    return {
      token: typeof parsed?.token === "string" ? parsed.token : "",
      user: parsed?.user && typeof parsed.user === "object" ? parsed.user : null,
    };
  } catch {
    return { token: "", user: null };
  }
}

function persistAuth(token, user) {
  const payload = {
    token: token || "",
    user: user || null,
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readPersistedAuth().token);
  const [user, setUser] = useState(() => readPersistedAuth().user);
  const [cloudState, setCloudState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!token) {
        setApiAuthToken("");
        if (!cancelled) {
          setLoading(false);
        }
        return;
      }

      setApiAuthToken(token);
      try {
        const session = await getCurrentUser();
        if (!cancelled) {
          setUser(session.user || null);
          setCloudState(session.state || null);
          setLoading(false);
        }
      } catch {
        setApiAuthToken("");
        persistAuth("", null);
        if (!cancelled) {
          setToken("");
          setUser(null);
          setCloudState(null);
          setLoading(false);
        }
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = async ({ email, name }) => {
    const session = await loginUser({ email, name });
    setApiAuthToken(session.token);
    persistAuth(session.token, session.user);
    setToken(session.token);
    setUser(session.user || null);
    setCloudState(session.state || null);
    return session;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore network errors and clear local session anyway.
    }

    setApiAuthToken("");
    persistAuth("", null);
    setToken("");
    setUser(null);
    setCloudState(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      cloudState,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      setCloudState,
    }),
    [token, user, cloudState, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
