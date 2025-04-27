import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    location: "",
    website: "",
  });
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in localStorage.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3060/api/users/${userId}`
        );
        setUserData(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          password: response.data.password,
          location: response.data.location,
          website: response.data.website,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.put(
        `http://localhost:3060/api/users/${userId}`,
        formData
      );
      setUserData(response.data);
      alert("User updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {userData && (
        <div className="profile-info">
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Location:</strong> {userData.location}</p>
          <p><strong>Website:</strong> {userData.website}</p>
        </div>
      )}

      {showUpdateForm && (
        <form onSubmit={handleSubmit} className="update-form">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Username"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Location"
          />
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="Website"
          />
          <button type="submit">Update Profile</button>
        </form>
      )}
      <button onClick={() => setShowUpdateForm(!showUpdateForm)}>
        {showUpdateForm ? "Cancel" : "Edit Profile"}
      </button>
    </div>
  );
};

export default Profile;
