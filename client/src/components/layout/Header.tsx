import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, User, Menu, Compass, MapPin, Camera } from 'lucide-react';
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
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  
  return (
    <header className={`sticky top-0 z-20 bg-gradient-nature from-primary-500 to-secondary-500 shadow-lg`}>
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <Compass className="h-8 w-8 text-accent-500" />
          <span className="text-2xl font-adventure text-white">AdventureShare</span>
        </Link>
        
        <div className="hidden md:block flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search adventures, skills, or destinations..."
              className="w-full py-2 pl-10 pr-4 rounded-button bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-accent-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/70" />
          </form>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-button bg-white/10 hover:bg-white/20 transition shadow-button hover:shadow-button-hover"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-accent-500" /> : <Moon className="h-5 w-5 text-white" />}
          </button>
          
          <div className="relative">
            <button 
              onClick={toggleNotifications} 
              className="p-2 rounded-button bg-white/10 hover:bg-white/20 transition shadow-button hover:shadow-button-hover"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && <NotificationDropdown />}
          </div>
          
          {/* User Menu */}
          <Link to={`/profile/${user?.username}`} className="p-2 rounded-button bg-white/10 hover:bg-white/20 transition shadow-button hover:shadow-button-hover">
            {user?.profilePictureUrl ? (
              <img 
                src={user.profilePictureUrl} 
                alt={user.name} 
                className="h-8 w-8 rounded-full object-cover border-2 border-accent-500"
              />
            ) : (
              <User className="h-6 w-6 text-white" />
            )}
          </Link>
          
          <button 
            className="md:hidden p-2 rounded-button bg-white/10 hover:bg-white/20 transition shadow-button hover:shadow-button-hover"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
      
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search adventures..."
            className="w-full py-2 pl-10 pr-4 rounded-button bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-accent-500"
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