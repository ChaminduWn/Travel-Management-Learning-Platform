import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"; 
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { AuthContextProvider } from "./context/authContext.jsx";
import Layout from "./components/layout/Layout";
import Header from "./components/layout/Header.jsx";
import ChatProvider from "./context/ChatProvider"; // Import ChatProvider
import ChatPage from "./pages/ChatPage.jsx"; // Import ChatPage

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        {/* Wrap the content with ChatProvider */}
        <ChatProvider>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow pt-16 mt-6">
              <div className="container px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  {/* Protected routes */}
                  <Route 
                    path="/profile/:id" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/settings" 
                    element={
                      <ProtectedRoute>
                        <div>Settings Page</div>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
  path="/chats" 
  element={
    <ProtectedRoute>
      <ChatPage />
    </ProtectedRoute>
  }
/>
                  
                  <Route path="*" element={<div>Page Not Found</div>} />
                </Routes>
              </div>
            </main>
          </div>
        </ChatProvider>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;