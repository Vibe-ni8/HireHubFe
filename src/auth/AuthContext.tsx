import { createContext, useContext, useState, type ReactNode } from "react"
import { clearToken, getCurrentUserId, getCurrentUserRole, getToken, isTokenExpired, setToken } from "../services/Token.service"


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export default function AuthProvider({ children }: AuthProviderProps) {

  const [isAuthenticated, setAuthentication] = useState( getToken() != null && !isTokenExpired() );

  const login = (token: string) => {
    setToken(token);
    setAuthentication(!isTokenExpired());
  }

  const logout = () => { 
    clearToken();
    setAuthentication(false); 
  }

  return (
    <AuthContext.Provider value={{ 
        isAuthenticated: isAuthenticated, 
        getRole: () => getCurrentUserRole(), 
        getUserId: () => getCurrentUserId(), 
        login, 
        logout 
      }}>
      {children}
    </AuthContext.Provider>
  );
  
}

export interface AuthContextType {
  isAuthenticated: boolean;
  getRole: () => string | null;
  getUserId: () => string | null;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}