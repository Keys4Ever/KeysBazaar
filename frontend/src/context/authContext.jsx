import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ authenticated: false, user: null });

  const fetchAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth-status', {
        credentials: 'include',
      });
      const data = await response.json();
      setAuth(data);
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  useEffect(() => {
    fetchAuthStatus();
  }, []);

  const login = () => {
    window.location.href = 'http://localhost:3000/login'; 
  };
  

  const logout = async () => {
    window.location.href = 'http://localhost:3000/logout'
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
