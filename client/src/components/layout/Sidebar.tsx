import { NavLink } from 'react-router-dom';
import { Home, User, Search, Bell, BookOpen, LogOut, MessageSquare, ClipboardList } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  
  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Profile', path: `/profile/${user?.userId}`, icon: <User className="w-5 h-5" /> },
    { name: 'Search', path: '/search', icon: <Search className="w-5 h-5" /> },
    { name: 'Notifications', path: '/notifications', icon: <Bell className="w-5 h-5" /> },
    { name: 'My Trip Planning', path: '/my-plans', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Chat Room', path: '/chat', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Quizzes', path: '/quizzes', icon: <ClipboardList className="w-5 h-5" /> }, // Added quizzes link
  ];

  return (
    <aside className={`w-64 sticky h-screen pt-10  top-16 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-sm overflow-y-auto p-4`}>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
              ${isActive 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                : 'hover:bg-gray-100 dark:hover:bg-slate-700'}
            `}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
        
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 space-x-3 text-left text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </nav>
      
      <div className={`mt-auto pt-4 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} mt-8`}>
        <div className="flex items-center px-4 py-2 space-x-3">
          {user?.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt={user.name} 
              className="object-cover w-10 h-10 rounded-full"
            />
          ) : (
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full dark:bg-indigo-900">
              <User className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium">{user?.name}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">@{user?.username}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;