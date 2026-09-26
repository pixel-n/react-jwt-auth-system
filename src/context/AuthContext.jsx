import React, { createContext, useContext, useState } from 'react';

// Central store for user authentication state
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Grab token from localStorage so login stays active on refresh
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // Save JWT token to state and browser storage
  const login = (jwtToken) => {
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
  };

  // Remove JWT token to log user out
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Easy hook to access auth context anywhere
export const useAuth = () => useContext(AuthContext);