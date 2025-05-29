import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
  });

//   const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a token in localStorage
    const savedToken = localStorage.getItem('access_token');
    const savedUser = JSON.parse(localStorage.getItem('user_data'));
    if (savedToken && savedUser) {
      setAuthState({
        token: savedToken,
        user: savedUser,
      });
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
    setAuthState({ token, user });
    // navigate('/'); // Redirect to home after login
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    setAuthState({ token: null, user: null });
    // navigate('/');// Redirect to login after logout
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};