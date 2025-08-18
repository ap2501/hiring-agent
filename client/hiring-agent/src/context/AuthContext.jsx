import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          // Fetch the user's profile using the token
          const response = await fetch(`${apiBaseUrl}/api/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser({ ...userData, token }); // Store full user profile + token
          } else {
            // If the token is invalid, clear it
            localStorage.removeItem("authToken");
          }
        } catch (error) {
          console.error("Failed to fetch profile on load", error);
          localStorage.removeItem("authToken");
        }
      }
      setLoading(false);
    };

    initializeUser();
  }, []);

  const login = (token) => {
    localStorage.setItem("authToken", token);
    // Reloading the page will trigger the useEffect to fetch the new user's profile
    window.location.reload();
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    window.location.reload();
  };

  const value = { user, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
