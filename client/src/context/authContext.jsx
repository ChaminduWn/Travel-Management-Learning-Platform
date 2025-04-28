import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";

export const AuthContext = createContext();

// Add this custom hook to make the context easily accessible
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/login", {
        username,
        password,
      });
      
      // Set the user in state and localStorage
      setCurrentUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      
      // Normally, the token would come from the server's response
      // For now, let's assume we need to generate one or get it from the user object
      const token = res.data.token || "sample-token"; // Replace with actual token from response
      setToken(token);
      localStorage.setItem("token", token);
      
      return res.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/register", {
        username,
        email,
        password,
      });
      return res.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUser = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  useEffect(() => {
    // Set up axios interceptors for authentication headers
    axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};