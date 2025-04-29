import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { app } from "../firebase";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider 
} from "firebase/auth";
import { useAuth } from '../context/authContext';
// import GoogleLogo from "../assets/google.png";
// import FacebookLogo from "../assets/facebook.png"

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const { login, currentUser } = useAuth(); // Using the login function from AuthContext

  // Add effect to check if user is logged in and redirect
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use the login function from AuthContext
      const userData = await login(formData.username, formData.password);
      
      // Check if login was successful
      if (userData) {
        // No need to navigate here, the useEffect will handle it
        console.log("Login successful", userData);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const saveFirebaseUserToBackend = async (firebaseUser) => {
    try {
      // First, check if user already exists with that email
      const username = firebaseUser.displayName || firebaseUser.email.split('@')[0];
      
      // Try to login with Firebase credentials
      const response = await axios.post("http://localhost:8087/api/firebase-login", {
        username: username,
        email: firebaseUser.email,
        firebaseId: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      });
      
      if (response.status === 200 && response.data) {
        const user = response.data;
        
        // Store user info and token in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        if (user.token) {
          localStorage.setItem('token', user.token);
          // Set default Authorization header for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
          
          // Log to verify token is being saved
          console.log("Token saved to localStorage:", user.token);
        } else {
          console.warn("No token received from Firebase login");
        }
        
        // No need to navigate here, the useEffect will handle it
      }
    } catch (error) {
      console.error("Error logging in with Firebase:", error);
      setError("Failed to login with social account. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Save Firebase user to backend / login
      await saveFirebaseUserToBackend(user);
    } catch (error) {
      console.error("Google login error:", error);
      setError("Google login failed. Please try again.");
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setError('');
    setLoading(true);
    const provider = new FacebookAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Save Firebase user to backend / login
      await saveFirebaseUserToBackend(user);
    } catch (error) {
      console.error("Facebook login error:", error);
      setError("Facebook login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="relative w-full max-w-md">
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-blue-500 rounded-2xl opacity-20 blur-xl"></div>
        
        <div className="relative p-8 bg-gray-800 border border-gray-700 shadow-2xl bg-opacity-80 backdrop-blur-sm rounded-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Welcome Back
            </h1>
            <p className="mt-2 text-gray-400">Sign in to your account</p>
          </div>
          
          {error && (
            <div className="p-3 mb-4 text-sm text-red-300 bg-red-900 border border-red-800 rounded-lg bg-opacity-40">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="flex items-center text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 text-white transition-all duration-200 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="flex items-center text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 text-white transition-all duration-200 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-400">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-400 transition-colors duration-200 hover:text-blue-300">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Sign In'
              )}
            </button>
            
            <div className="my-2 text-center">
              <span className="text-gray-400">Or login with</span>
            </div>
            
            <button 
              type="button" 
              onClick={handleGoogleSignIn} 
              className="flex items-center justify-center w-full px-4 py-3 text-gray-800 transition-all duration-300 bg-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              {/* <img src={GoogleLogo} alt="Google" className="w-5 h-5 mr-2" /> */}
              <span className="mr-2">GOOGLE</span>
              Sign in with Google
            </button>
            
            <button 
              type="button" 
              onClick={handleFacebookSignIn} 
              className="flex items-center justify-center w-full px-4 py-3 text-white transition-all duration-300 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              {/* <img src={FacebookLogo} alt="Facebook" className="w-5 h-5 mr-2" /> */}
              <span className="mr-2">facebook</span>
              Sign in with Facebook
            </button>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <a href="/register" className="font-medium text-blue-400 transition-colors duration-200 hover:text-blue-300">
                  Register here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;