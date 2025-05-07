import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const location = useLocation();
  const { user, loginWithOAuth, loading, handleOAuthCallback } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  // Check if this is an OAuth callback
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  const errorParam = params.get('error');
  
  // Handle OAuth callback if token is present
  if (token && !user && !loading) {
    handleOAuthCallback(token);
  }

  // Show error if present in URL params
  if (errorParam && !error) {
    setError(decodeURIComponent(errorParam));
  }
  
  // If already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  const handleLogin = (provider: 'google' | 'github') => {
    try {
      setError(null);
      loginWithOAuth(provider);
    } catch (err) {
      setError('Failed to login. Please try again.');
      console.error(err);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-indigo-100 to-white dark:from-indigo-950 dark:to-slate-900">
      <div className="w-full max-w-md p-8 bg-white shadow-xl dark:bg-slate-800 rounded-2xl">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">AdventureShare</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Connect, learn, and share skills in Navigation, Photography, and Adventure Sports
          </p>
        </div>
        
        {/* Login Options */}
        <div className="space-y-4">
          <button
            onClick={() => handleLogin('google')}
            disabled={loading}
            className="flex items-center justify-center w-full px-4 py-3 space-x-3 font-medium text-gray-700 transition bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 dark:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            <span>Continue with Google</span>
          </button>
          
          <button
            onClick={() => handleLogin('github')}
            disabled={loading}
            className="flex items-center justify-center w-full px-4 py-3 space-x-3 font-medium text-white transition bg-gray-800 rounded-lg hover:bg-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>Continue with GitHub</span>
          </button>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="p-3 mt-4 text-sm text-red-800 bg-red-100 rounded-lg dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}
        
        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Info Text */}
        <div className="mt-8 text-sm text-center text-gray-500 dark:text-gray-400">
          <p>By continuing, you agree to AdventureShare's</p>
          <div className="flex justify-center mt-1 space-x-3">
            <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms of Service</a>
            <span>&amp;</span>
            <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          AdventureShare - Empowering Adventure through community
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          &copy; 2025 AdventureShare, Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;