import { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { 
  User as AuthUser, 
  getCurrentUser, 
  initiateOAuthLogin, 
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout 
} from '../services/api/auth';

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithOAuth: (provider: 'google' | 'github') => void;
  handleOAuthCallback: (token: string, userId?: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData);
        localStorage.setItem('userId', userData.id);
      } else {
        setUser(null);
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setUser(null);
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user, token } = await apiLogin(email, password);
      localStorage.setItem('token', token);
      if (user?.id) localStorage.setItem('userId', user.id);
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const { user, token } = await apiRegister(name, email, password);
      localStorage.setItem('token', token);
      if (user?.id) localStorage.setItem('userId', user.id);
      setUser(user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
  };

  const loginWithOAuth = (provider: 'google' | 'github') => {
    initiateOAuthLogin(provider);
  };

  const handleOAuthCallback = async (token: string, userId?: string) => {
    try {
      setLoading(true);
      localStorage.setItem('token', token);
      if (userId) localStorage.setItem('userId', userId);
      
      // Load full user profile
      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData);
        localStorage.setItem('userId', userData.id);
      } else {
        throw new Error('Failed to load user profile');
      }
    } catch (error) {
      console.error("OAuth callback failed:", error);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check for OAuth2 callback on initial load
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userId = urlParams.get('userId');
    const error = urlParams.get('error');

    if (token) {
      handleOAuthCallback(token, userId || undefined).then(() => {
        // Clear query parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      }).catch((err) => {
        console.error('OAuth callback error:', err);
      });
    } else if (error) {
      console.error('OAuth error:', decodeURIComponent(error));
    } else {
      loadUser();
    }
  }, [loadUser]);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      loginWithOAuth,
      handleOAuthCallback
    }}>
      {children}
    </AuthContext.Provider>
  );
};