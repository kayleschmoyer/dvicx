import React, { createContext, useState, ReactNode, useEffect } from 'react';
import api from '../services/api';

interface AuthContextProps {
  mechanicId: string | null;
  token: string | null;
  login: (mechanicId: string, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  mechanicId: null,
  token: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [mechanicId, setMechanicId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = (id: string, authToken: string) => {
    setMechanicId(id);
    setToken(authToken);
  };

  const logout = () => {
    setMechanicId(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ mechanicId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
