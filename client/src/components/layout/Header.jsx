import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Bell, User, LogOut, Compass } from 'lucide-react';
import { useAuth } from '../../context/authContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-md">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center flex-shrink-0 space-x-2">
              <Compass className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold tracking-tight text-blue-800">TravelShare</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="items-center justify-between flex-1 hidden px-8 md:flex">
            {/* Main Nav Links */}
            <nav className="flex items-center space-x-6">
              <Link to="/" className="px-2 py-1 text-sm font-medium text-gray-700 transition duration-150 hover:text-blue-600">
                Home
              </Link>
              <Link to="/trip-plans" className="px-2 py-1 text-sm font-medium text-gray-700 transition duration-150 hover:text-blue-600">
                Trip Plans
              </Link>
              <Link to="/destinations" className="px-2 py-1 text-sm font-medium text-gray-700 transition duration-150 hover:text-blue-600">
                Destinations
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="w-full max-w-lg px-4">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  className="block w-full py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search destinations, trips, or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          </div>

          {/* User Actions */}
          <div className="items-center hidden space-x-4 md:flex">
            {user ? (
              <div className="flex items-center space-x-4">
                <button className="relative text-gray-700 hover:text-blue-600">
                  <Bell className="w-5 h-5" />
                  <span className="absolute w-3 h-3 bg-red-500 rounded-full -top-1 -right-1"></span>
                </button>
                <div className="relative group">
                  <Link to={`/profile/${user.id}`} className="block">
                    <div className="relative w-8 h-8 overflow-hidden bg-gray-100 rounded-full ring-2 ring-gray-200">
                      {user.pic ? (
                        <img src={user.pic} alt={user.username} className="object-cover w-full h-full" />
                      ) : (
                        <User className="absolute w-5 h-5 text-gray-500 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
                      )}
                    </div>
                  </Link>
                  <div className="absolute right-0 z-10 hidden w-48 py-1 mt-2 bg-white border border-gray-200 rounded-md shadow-lg group-hover:block">
                    <Link to={`/profile/${user.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                    <button onClick={logout} className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Sign in
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white transition duration-150 bg-blue-600 rounded-md hover:bg-blue-700">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 text-gray-700 rounded-md hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="block w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="bg-white border-t border-gray-200 md:hidden">
          <div className="px-4 pt-4 pb-3 space-y-3">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  className="block w-full py-2 pl-10 pr-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            
            {/* Mobile Navigation Links */}
            <nav className="grid gap-y-2">
              <Link
                to="/"
                className="flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-50"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                to="/"
                className="flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-50"
                onClick={toggleMenu}
              >
                Trip Plans
              </Link>
              <Link
                to="/"
                className="flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-50"
                onClick={toggleMenu}
              >
                Destinations
              </Link>
            </nav>
            
            {/* Mobile User Actions */}
            <div className="pt-2 border-t border-gray-200">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center px-3 py-2 space-x-3">
                    <div className="w-10 h-10 overflow-hidden bg-gray-200 rounded-full">
                      {user.pic ? (
                        <img src={user.pic} alt={user.username} className="object-cover w-full h-full" />
                      ) : (
                        <User className="w-6 h-6 m-2 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">{user.username}</h3>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to={`/profile/${user.id}`}
                    className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-50"
                    onClick={toggleMenu}
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/"
                    className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-50"
                    onClick={toggleMenu}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="flex items-center block w-full px-3 py-2 text-base font-medium text-left text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-center text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                    onClick={toggleMenu}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-base font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    onClick={toggleMenu}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;