import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { updateUserProfile } from '../../services/api.ts';
import { User, X, Camera, Save } from 'lucide-react';

const ProfileEditForm = ({ profile, onCancel, onSave }) => {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio || '');
  const [location, setLocation] = useState(profile.location || '');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(profile.profilePicture || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
      setErrors((prev) => ({ ...prev, image: 'Only JPG and PNG files are allowed' }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Image must be less than 2MB' }));
      return;
    }

    setErrors((prev) => ({ ...prev, image: '' }));
    setProfileImage(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (bio.length > 500) {
      newErrors.bio = 'Bio cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const updatedProfile = await updateUserProfile({
        ...profile,
        name,
        bio,
        location,
        profileImage
      });

      onSave(updatedProfile);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setErrors((prev) => ({ ...prev, form: 'Failed to update profile. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
        <button
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center mb-6">
          <div className="relative h-32 w-32 mb-4">
            <div className="h-full w-full rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md">
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600">
                  <User className="h-12 w-12" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-primary-700 transition-colors">
              <Camera className="h-5 w-5" />
              <input
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {errors.image && (
            <p className="text-red-600 text-sm mb-2">{errors.image}</p>
          )}

          <p className="text-sm text-gray-500 mb-2">
            Upload a new profile picture (JPG or PNG, max 2MB)
          </p>
        </div>

        <div className="space-y-4 max-w-md mx-auto">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              maxLength={50}
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={`input-field min-h-[100px] ${errors.bio ? 'border-red-500' : ''}`}
              maxLength={500}
            ></textarea>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{bio.length}/500 characters</span>
              {errors.bio && (
                <p className="text-red-600">{errors.bio}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-field"
              placeholder="e.g., New York, USA"
              maxLength={100}
            />
          </div>

          {errors.form && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {errors.form}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
              {!isSubmitting && <Save className="h-4 w-4 ml-2" />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;
