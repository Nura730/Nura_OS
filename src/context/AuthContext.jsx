import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("nura_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("nura_token") || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && token) {
      localStorage.setItem("nura_user", JSON.stringify(user));
      localStorage.setItem("nura_token", token);
    } else {
      localStorage.removeItem("nura_user");
      localStorage.removeItem("nura_token");
    }
  }, [user, token]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setToken(data.token);
        navigate("/");
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setToken(data.token);
        navigate("/");
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
