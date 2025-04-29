import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Use the same key as your AuthContext to ensure consistency
    const userInfo = JSON.parse(localStorage.getItem("user"));
    setUser(userInfo);

    // Only redirect if we're on a protected chat route
    if (!userInfo && window.location.pathname.includes("/chats")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("ChatState must be used within a ChatProvider");
  }
  return context;
};

export default ChatProvider;