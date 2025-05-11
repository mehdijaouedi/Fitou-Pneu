import React, { createContext, useState, useContext, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);
// eslint-disable-next-line react-refresh/use-context-provider
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);
  //   const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
          localStorage.removeItem("user");
          setUser(null);
        }
      }
    }
  }, []);

  const loginAction = (accessToken, userData) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
    setLoginModalOpen(false); // Close modal on successful login
    // No navigate here, let the component calling loginAction decide
  };

  const logoutAction = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    // navigate('/login'); // Navigate to login page on logout
  };

  const openLoginModal = () => {
    setLoginModalOpen(true);
    setSignUpModalOpen(false);
  };
  const closeLoginModal = () => setLoginModalOpen(false);
  const openSignUpModal = () =>{ setSignUpModalOpen(true)
    setLoginModalOpen(false);
  };
  const closeSignUpModal = () => setSignUpModalOpen(false);

  const isAuthenticated = !!token;

  const value = {
    token,
    user,
    isAuthenticated,
    loginAction,
    logoutAction,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    setLoginModalOpen, // Allow direct control if needed
    openSignUpModal,
    closeSignUpModal,
    isSignUpModalOpen,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
