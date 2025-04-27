import React, { useState, useEffect } from "react";
import axios from "axios";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    location: '',
    website: ''
  });
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in localStorage.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3060/api/users/${userId}`);
        setUserData(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          password: response.data.password,
          location: response.data.location,
          website: response.data.website
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.put(`http://localhost:3060/api/users/${userId}`, formData);
      setUserData(response.data);
      alert('User updated successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  if (loading) return <div className="text-center mt-10 text-xl font-bold">Loading...</div>;

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="relative w-full max-w-4xl">
        <img
          src="https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg"
          alt="cover"
          className="w-full h-48 object-cover rounded-lg"
        />
        <img
          src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg"
          alt="profile"
          className="absolute top-28 left-10 w-32 h-32 object-cover rounded-full border-4 border-white"
        />
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl mt-16">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-3">
            <a href="#"><FacebookTwoToneIcon /></a>
            <a href="#"><InstagramIcon /></a>
            <a href="#"><TwitterIcon /></a>
            <a href="#"><LinkedInIcon /></a>
            <a href="#"><PinterestIcon /></a>
          </div>
          <MoreVertIcon />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold">{userData.username}</h2>
          <div className="flex justify-center space-x-6 mt-4 text-gray-600">
            <div className="flex items-center space-x-2">
              <PlaceIcon /><span>{userData.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <LanguageIcon /><span>{userData.website}</span>
            </div>
            <div className="flex items-center space-x-2">
              <EmailOutlinedIcon /><span>{userData.email}</span>
            </div>
          </div>
        </div>

        {showUpdateForm ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
            <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="border p-2 rounded" />
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="border p-2 rounded" />
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="border p-2 rounded" />
            <button type="submit" className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700">Update</button>
          </form>
        ) : (
          <div className="flex justify-center mt-6">
            <button onClick={() => setShowUpdateForm(true)} className="bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700">
              Update Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
