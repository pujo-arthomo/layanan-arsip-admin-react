import { createContext, useContext } from "react";
import { useAuth as useAuthState } from "../../hooks/useAuth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useAuthState();
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}