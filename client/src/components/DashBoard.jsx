import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-16 h-16 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="container px-4 py-8 mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Travel Management
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-gray-300">Welcome back,</p>
              <p className="font-medium">{user.username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 transition duration-200 bg-red-600 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </header>
        
        <div className="p-8 bg-gray-800 bg-opacity-50 border border-gray-700 shadow-xl backdrop-blur-sm rounded-2xl">
          <h2 className="mb-6 text-2xl font-semibold">Dashboard</h2>
          <p className="mb-4 text-gray-300">
            Welcome to your travel management dashboard. Here you can manage your trips, view bookings, and more.
          </p>
          <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3">
            <div className="p-6 transition duration-300 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl hover:border-blue-500">
              <div className="mb-4 text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-medium">My Bookings</h3>
              <p className="text-gray-400">View and manage your current bookings.</p>
            </div>
            
            <div className="p-6 transition duration-300 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl hover:border-blue-500">
              <div className="mb-4 text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-medium">Travel History</h3>
              <p className="text-gray-400">Check your past travels and experiences.</p>
            </div>
            
            <div className="p-6 transition duration-300 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl hover:border-blue-500">
              <div className="mb-4 text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-medium">New Booking</h3>
              <p className="text-gray-400">Create a new booking for your next adventure.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;