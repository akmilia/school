import { createContext, useContext, ReactNode, useState } from "react";
import axios, { AxiosResponse } from "axios";

interface User {
  id: number;
  role: string;
  access_token: string;
  refresh_token: string;
}

interface BearerSchema {
  access_token: string;
  refresh_token: string;
  role: string;
  token_type: string;
  user_id: number;
}

interface AuthContextType {
  user: User | null;
  login: (access: string, refresh: string, role: string, userId: number) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
  isInitialized: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  refreshToken: () => {},
  isInitialized: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');
    const role = localStorage.getItem('user_role');
    const userId = localStorage.getItem('user_id');
    return access_token && role && userId && refresh_token
      ? { id: Number(userId), role, access_token, refresh_token }
      : null;
  });

  const login = (access: string, refresh: string, role: string, userId: number) => {
    const userData: User = { id: userId, role, access_token: access, refresh_token: refresh };
    setUser(userData);
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user_role', role);
    localStorage.setItem('user_id', userId.toString());
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
  };

  const refreshToken = async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) {
      logout();
      return;
    }

    try {
      const response: AxiosResponse<BearerSchema> = await axios.post<BearerSchema>(
        `${import.meta.env.VITE_BASE_URL}/refresh`,
        { refresh_token }
      );

      login(
        response.data.access_token,
        response.data.refresh_token,
        response.data.role,
        response.data.user_id
      );
    } catch (error) {
      logout();
    }
  };

  const isInitialized = true;

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshToken, isInitialized }}>
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

// import { createContext, useContext, ReactNode, useState } from "react";

// interface User {
//   id: number;
//   role: string;
//   token: string;
  
// }
// interface AuthContextType {
//   user: User | null;
//   login: (token: string, role: string, userId: number) => void;
//   logout: () => void;
//   isInitialized: boolean;
// } 


// export const AuthContext = createContext<AuthContextType>({
//   user: null,
//   login: () => {},
//   logout: () => {},
//   isInitialized: false,
// }); 


// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(() => {
//     const token = localStorage.getItem('access_token');
//     const role = localStorage.getItem('user_role');
//     const userId = localStorage.getItem('user_id');
//     return token && role && userId 
//       ? { id: Number(userId), role, token } 
//       : null;
//   });

//   const login = (token: string, role: string, userId: number) => {
//     const userData = { id: userId, role, token };
//     setUser(userData);
//     localStorage.setItem('access_token', token); 
//     localStorage.setItem('user_role', role);
//     localStorage.setItem('user_id', userId.toString());
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('access_token');  // Было 'token'
//     localStorage.removeItem('user_role');
//     localStorage.removeItem('user_id');
// };
//   // Остальное без изменений
//   const isInitialized = true;

//   return (
//     <AuthContext.Provider value={{ user, login, logout, isInitialized}}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
