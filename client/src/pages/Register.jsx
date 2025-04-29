import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { app } from "../firebase";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider 
} from "firebase/auth";
import GoogleLogo from "../assets/google.png";
// import FacebookLogo from "../assets/facebook.png"

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);

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

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = formData;
      
      const response = await axios.post('http://localhost:8087/api/register', registerData);
      
      if (response.data) {
        // Navigate to login after successful registration
        navigate('/login');
      }
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.includes('Invalid email format')) {
        setError('Please enter a valid email address');
      } else {
        setError(err.response?.data || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const saveFirebaseUserToBackend = async (firebaseUser) => {
    setLoading(true);
    try {
      // Create a username from the display name or email
      const username = firebaseUser.displayName || firebaseUser.email.split('@')[0];
      
      // Register the user with Firebase credentials
      const response = await axios.post("http://localhost:8087/api/register", {
        username: username,
        email: firebaseUser.email,
        password: firebaseUser.uid // Using Firebase UID as password for simplicity
      });
      
      if (response.data) {
        // Navigate to login after successful registration
        navigate('/login');
      }
    } catch (error) {
      console.error("Error saving Firebase user to backend:", error);
      
      if (error.response && error.response.status === 400 && error.response.data.includes('already exists')) {
        setError('Account with this email already exists. Please login instead.');
      } else {
        setError("Failed to register with social login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Save Firebase user to backend
      await saveFirebaseUserToBackend(user);
    } catch (error) {
      console.error("Google registration error:", error);
      setError("Google registration failed. Please try again.");
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
      
      // Save Firebase user to backend
      await saveFirebaseUserToBackend(user);
    } catch (error) {
      console.error("Facebook registration error:", error);
      setError("Facebook registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="relative w-full max-w-md">
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-purple-500 rounded-2xl opacity-20 blur-xl"></div>
        
        <div className="relative p-8 bg-gray-800 border border-gray-700 shadow-2xl bg-opacity-80 backdrop-blur-sm rounded-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Create Account
            </h1>
            <p className="mt-2 text-gray-400">Join our travel platform</p>
          </div>
          
          {error && (
            <div className="p-3 mb-4 text-sm text-red-300 bg-red-900 border border-red-800 rounded-lg bg-opacity-40">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full px-4 py-3 text-white transition-all duration-200 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 text-white transition-all duration-200 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-4 py-3 text-white transition-all duration-200 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="flex items-center text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 text-white transition-all duration-200 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-4 mt-6 rounded-lg text-white font-medium transition-all duration-300 ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Register'
              )}
            </button>
            
            <div className="my-2 text-center">
              <span className="text-gray-400">Or register with</span>
            </div>
            
            <button 
              type="button" 
              onClick={handleGoogleSignIn} 
              className="flex items-center justify-center w-full px-4 py-3 text-gray-800 transition-all duration-300 bg-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              disabled={loading}
            >
              <span className="mr-2">GOOGLE</span>
              Sign up with Google
            </button>
            
            <button 
              type="button" 
              onClick={handleFacebookSignIn} 
              className="flex items-center justify-center w-full px-4 py-3 text-white transition-all duration-300 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              <span className="mr-2">facebook</span>
              Sign up with Facebook
            </button>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <a href="/login" className="font-medium text-blue-400 transition-colors duration-200 hover:text-blue-300">
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;