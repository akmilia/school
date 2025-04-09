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

// const [user, setUser] = useState<User | null>(() => {
//   const token = localStorage.getItem('access_token');
//   const role = localStorage.getItem('user_role');
//   return token && role ? { id: 0, role, token } : null; // id можно получить из токена
// });

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
    localStorage.setItem('access_token', token); 
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
