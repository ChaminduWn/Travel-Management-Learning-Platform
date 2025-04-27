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
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <Compass className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-primary-800 tracking-tight">TravelShare</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between flex-1 px-8">
            {/* Main Nav Links */}
            <nav className="flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-primary-600 px-2 py-1 text-sm font-medium transition duration-150">
                Home
              </Link>
              <Link to="/trip-plans" className="text-gray-700 hover:text-primary-600 px-2 py-1 text-sm font-medium transition duration-150">
                Trip Plans
              </Link>
              <Link to="/quizzes" className="text-gray-700 hover:text-primary-600 px-2 py-1 text-sm font-medium transition duration-150">
                Quizzes
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="max-w-lg w-full px-4">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Search users, posts, or trip plans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <button className="text-gray-700 hover:text-primary-600 relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </button>
                <div className="relative group">
                  <Link to={`/profile/${user.id}`} className="block">
                    <div className="relative w-8 h-8 overflow-hidden bg-gray-100 rounded-full ring-2 ring-gray-200">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-5 w-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500" />
                      )}
                    </div>
                  </Link>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block border border-gray-200">
                    <Link to={`/profile/${user.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                  Sign in
                </Link>
                <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-4 pb-3 space-y-3">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                className="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium flex items-center"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                to="/trip-plans"
                className="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium flex items-center"
                onClick={toggleMenu}
              >
                Trip Plans
              </Link>
              <Link
                to="/quizzes"
                className="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium flex items-center"
                onClick={toggleMenu}
              >
                Quizzes
              </Link>
            </nav>
            
            {/* Mobile User Actions */}
            <div className="pt-2 border-t border-gray-200">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-6 w-6 m-2 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">{user.name || 'User'}</h3>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to={`/profile/${user.id}`}
                    className="text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={toggleMenu}
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={toggleMenu}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="text-gray-700 hover:bg-gray-50 w-full text-left block px-3 py-2 rounded-md text-base font-medium flex items-center"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    to="/login"
                    className="text-primary-600 hover:bg-primary-50 text-center block px-3 py-2 rounded-md text-base font-medium border border-primary-600"
                    onClick={toggleMenu}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 hover:bg-primary-700 text-white text-center block px-3 py-2 rounded-md text-base font-medium"
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