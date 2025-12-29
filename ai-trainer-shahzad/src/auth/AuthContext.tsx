import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";

interface User {
  email?: string;
  username?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // 🔥 NEW

  /* LOAD USER ON REFRESH */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      loadUser(token).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async (token: string) => {
    try {
      const res = await axios.get("/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch {
      logout();
    }
  };

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    setLoading(true);
    await loadUser(token); // ✅ keep your logic
    setLoading(false);     // 🔥 key line
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
