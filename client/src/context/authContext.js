import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    // This is a placeholder for your actual login logic
    try {
      // Simulate successful login
      const user = { id: 1, username: inputs.username };
      setCurrentUser(user);
      return user;
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    // Clear user data
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  const register = async (inputs) => {
    // This is a placeholder for your actual registration logic
    try {
      // Simulate successful registration
      const user = { id: Date.now(), username: inputs.username };
      setCurrentUser(user);
      return user;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context (referenced in Home.jsx)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};