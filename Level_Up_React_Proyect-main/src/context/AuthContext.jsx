
import React, { createContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext();

// Lee la URL del backend desde variables de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

// Helper para fetch con JSON
async function http(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "omit",
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    // Devuelve el texto tal cual si no es JSON válido
    const msg = (typeof data === 'string' ? data : (data?.message || data?.error || `HTTP ${res.status}`));
    throw new Error(msg);
  }
  // Si data es string (porque no era JSON válido), intentamos parsearla como JSON
  if (typeof data === 'string' && data.trim().startsWith('{')) {
    try { return JSON.parse(data); } catch {}
  }
  return data;
}

const STORAGE_KEY = "levelup:user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario al iniciar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = (u) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  // Login contra /api/auth/login
  const login = async ({ email, password }) => {
    try {
      const data = await http("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      persist(data);
      return data;
    } catch (e) {
      throw new Error("Credenciales Inválidas");
    }
  };

  // Registro contra /api/auth/register
  const register = async ({ name, email, password, address, phone }) => {
    try {
      const data = await http("/api/auth/register", {
        method: "POST",
        body: { name, email, password, role: "USER", address, phone },
      });
      persist(data);
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Actualizar perfil contra /api/users/{id}
  const updateProfile = async (updates) => {
    if (!user?.id) throw new Error("No hay usuario en sesión");
    const data = await http(`/api/users/${user.id}`, {
      method: "PUT",
      body: updates,
    });
    persist(data);
    return data;
  };

  const logout = () => persist(null);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      apiUrl: API_URL,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
