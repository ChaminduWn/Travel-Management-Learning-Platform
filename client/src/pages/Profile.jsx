import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';

const Profile = () => {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    pic: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        password: '',
        confirmPassword: '',
        pic: currentUser.pic || '',
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFormData({
          ...formData,
          pic: reader.result,
        });
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Password validation
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...updateData } = formData;
      
      // If password is empty, don't update it
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await axios.put(
        `http://localhost:8080/api/users/${currentUser.id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      if (response.data) {
        // Update the context with new user data
        updateUser(response.data);
        setSuccess('Profile updated successfully!');
        setEditMode(false);
      }
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.includes('Invalid email format')) {
        setError('Please enter a valid email address');
      } else {
        setError(err.response?.data || 'Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl px-4 py-8 mx-auto">
      <div className="relative p-8 overflow-hidden bg-gray-800 border border-gray-700 shadow-2xl bg-opacity-80 backdrop-blur-sm rounded-2xl">
        {/* Background effects */}
        <div className="absolute top-0 right-0 w-64 h-64 -mt-32 -mr-32 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 -mb-32 -ml-32 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col items-center gap-8 mb-8 md:flex-row md:items-start">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 overflow-hidden transition-all duration-300 border-4 border-gray-700 rounded-full group-hover:border-blue-500">
                  {formData.pic ? (
                    <img 
                      src={formData.pic} 
                      alt={formData.username} 
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-600">
                      <span className="text-4xl font-bold text-gray-400">
                        {formData.username?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                </div>
                
                {editMode && (
                  <label className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 transition-all duration-200 bg-blue-500 border-2 border-gray-800 rounded-full cursor-pointer hover:bg-blue-600">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                   <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>
                  </label>
                )}
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                {!editMode ? formData.username : 'Edit Profile'}
              </h1>
              {!editMode && (
                <>
                  <p className="mb-4 text-gray-300">{formData.email}</p>
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-6 py-2 font-medium text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
          
          {error && (
            <div className="p-3 mb-6 text-sm text-red-300 bg-red-900 border border-red-800 rounded-lg bg-opacity-40">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 mb-6 text-sm text-green-300 bg-green-900 border border-green-800 rounded-lg bg-opacity-40">
              {success}
            </div>
          )}
          
          {editMode ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="flex items-center text-sm font-medium text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
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
                <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-white transition-all duration-200 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="flex items-center text-sm font-medium text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-white transition-all duration-200 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="flex items-center text-sm font-medium text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-white transition-all duration-200 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
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
                    'Save Changes'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setError('');
                    setSuccess('');
                    // Reset form to current user data
                    if (currentUser) {
                      setFormData({
                        username: currentUser.username || '',
                        email: currentUser.email || '',
                        password: '',
                        confirmPassword: '',
                        pic: currentUser.pic || '',
                      });
                    }
                  }}
                  className="flex-1 px-4 py-3 font-medium text-white transition-all duration-200 bg-gray-700 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-3">
              <div className="p-6 transition duration-300 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl hover:border-blue-500">
                <div className="mb-4 text-blue-400">
                  {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg> */}
                </div>
                <h3 className="mb-2 text-xl font-medium">My Bookings</h3>
                <p className="text-gray-400">View all your current and upcoming travel bookings.</p>
              </div>
              
              <div className="p-6 transition duration-300 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl hover:border-blue-500">
                <div className="mb-4 text-purple-400">
                  {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg> */}
                </div>
                <h3 className="mb-2 text-xl font-medium">Travel History</h3>
                <p className="text-gray-400">Access your complete travel history and past adventures.</p>
              </div>
              
              <div className="p-6 transition duration-300 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl hover:border-blue-500">
                <div className="mb-4 text-green-400">
                  {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg> */}
                </div>
                <h3 className="mb-2 text-xl font-medium">Account Settings</h3>
                <p className="text-gray-400">Manage your preferences and account security settings.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;