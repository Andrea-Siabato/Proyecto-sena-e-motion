import { createContext, useContext, useState } from "react";

const AuthCtx = createContext();
export const useAuth = () => useContext(AuthCtx);

/** Sesion del usuario (persistida en localStorage). */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const login = (u) => { localStorage.setItem("user", JSON.stringify(u)); setUser(u); };
  const logout = () => { localStorage.removeItem("user"); setUser(null); };
  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
}
