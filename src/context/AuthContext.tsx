import { createContext, useContext, ReactNode, useState } from "react";

interface User {
  id: number;
  role: string;
  token: string;
}
type UserRole = 'Ученик' | 'Преподаватель' | 'Администратор';
interface AuthContextType {
  user: User | null;
  login: (token: string, role: string, userId: number) => void;
  logout: () => void;
  isInitialized: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isInitialized: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string, role: string, userId: number) => {
    setUser({ id: userId, role, token });
    localStorage.setItem('token', token);
    localStorage.setItem('user_role', role);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
  }; 
  
  const isInitialized = true;

  return (
    <AuthContext.Provider value={{ user, login, logout, isInitialized}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
