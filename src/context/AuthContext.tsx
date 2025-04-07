import { createContext, useContext, ReactNode, useState } from "react";

interface User {
  id: number;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, role: string, userId: number) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string, role: string, userId: number) => {
    setUser({ id: userId, role, token });
    localStorage.setItem("token", token); // Сохраняем токен
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);