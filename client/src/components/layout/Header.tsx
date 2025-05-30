import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, User, Menu, Compass } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotification } from '../../contexts/NotificationContext';
import NotificationDropdown from '../notifications/NotificationDropdown';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="top-0 h-20 pb-10 shadow-lg paddigz-20 bg-gradient-nature from-primary-500 to-secondary-500">
      <div className="flex items-center justify-between h-full max-w-screen-xl px-4 py-3 mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Compass className="w-8 h-8 text-accent-500" />
          <span className="text-2xl text-white font-adventure">AdventureShare</span>
        </Link>

        {/* Search bar - Desktop */}
        <div className="flex-1 hidden max-w-md mx-4 md:block">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search adventures, skills, or destinations..."
              className="w-full py-2 pl-10 pr-4 text-white rounded-button bg-white/10 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-accent-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/70" />
          </form>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* Theme switch */}
          <button
            onClick={toggleTheme}
            className="p-2 transition rounded-button bg-white/10 hover:bg-white/20 shadow-button hover:shadow-button-hover"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-accent-500" />
            ) : (
              <Moon className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 transition rounded-button bg-white/10 hover:bg-white/20 shadow-button hover:shadow-button-hover"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-white" />
              {unreadCount > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white rounded-full -top-1 -right-1 bg-accent-500">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && <NotificationDropdown />}
          </div>

          {/* User profile */}
          <Link
            to={`/profile/${user?.username}`}
            className="p-2 transition rounded-button bg-white/10 hover:bg-white/20 shadow-button hover:shadow-button-hover"
          >
            {user?.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt={user.name}
                className="object-cover w-8 h-8 border-2 rounded-full border-accent-500"
              />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="p-2 transition md:hidden rounded-button bg-white/10 hover:bg-white/20 shadow-button hover:shadow-button-hover"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Search bar - Mobile */}
      <div className="px-4 pb-3 md:hidden">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search adventures..."
            className="w-full py-2 pl-10 pr-4 text-white rounded-button bg-white/10 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-accent-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/70" />
        </form>
      </div>
    </header>
  );
};

export default Header;
