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
      const res = await axios.post("http://localhost:8087/api/login", {
        username,
        password,
      });
      
      // Check if response contains data
      if (!res.data) {
        throw new Error("No data received from server");
      }
      
      // Set the user in state and localStorage
      const userData = res.data;
      
      // Check if the token is in the response
      let tokenFromResponse;
      
      if (userData.token) {
        // If token is directly in the user object
        tokenFromResponse = userData.token;
      } else if (res.data.token) {
        // If token is in the response but not in the user object
        tokenFromResponse = res.data.token;
        userData.token = tokenFromResponse; // Add token to user object for consistency
      }
      
      if (tokenFromResponse) {
        // Store token
        setToken(tokenFromResponse);
        localStorage.setItem("token", tokenFromResponse);
        
        // Set default Authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenFromResponse}`;
        
        console.log("Token stored in localStorage:", tokenFromResponse);
      } else {
        console.warn("No token received from server during login");
      }
      
      // Store user data after ensuring token is included
      setCurrentUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8087/api/register", {
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
    // Clear user and token from state
    setCurrentUser(null);
    setToken(null);
    
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Remove Authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    console.log("User logged out, token and user data cleared");
  };

  const updateUser = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  useEffect(() => {
    // Set up axios interceptors for authentication headers
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const currentToken = localStorage.getItem("token");
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Handle token expiration or unauthorized responses
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Token expired or invalid, logout user
          logout();
        }
        return Promise.reject(error);
      }
    );

    // Clean up interceptors on unmount
    return () => {
      axios.interceptors.request.eject(interceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
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

export default AuthContextProvider;