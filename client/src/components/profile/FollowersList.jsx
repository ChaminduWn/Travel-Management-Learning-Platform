import React from 'react';
import { Link } from 'react-router-dom';
import { X, UserPlus, UserCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { followUser, unfollowUser } from '../../services/api.ts';

const FollowersList = ({ title, users, onClose }) => {
  const { user } = useAuth();

  const handleFollowToggle = async (userId, isFollowing) => {
    try {
      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
    } catch (error) {
      console.error('Failed to follow/unfollow user:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl animate-fade-in">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-96 p-2">
          {users.length > 0 ? (
            <ul>
              {users.map(profile => (
                <li key={profile.id} className="p-2">
                  <div className="flex items-center justify-between">
                    <Link 
                      to={`/profile/${profile.id}`}
                      className="flex items-center flex-grow hover:bg-gray-50 p-2 rounded-lg"
                      onClick={onClose}
                    >
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                        {profile.profilePicture ? (
                          <img 
                            src={profile.profilePicture} 
                            alt={profile.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600">
                            <User className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-900">{profile.name}</h3>
                        {profile.location && (
                          <p className="text-sm text-gray-500">{profile.location}</p>
                        )}
                      </div>
                    </Link>
                    
                    {user && user.id !== profile.id && (
                      <button 
                        onClick={() => handleFollowToggle(profile.id, profile.isFollowing || false)}
                        className={`ml-2 p-2 rounded-full ${
                          profile.isFollowing 
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                            : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                        }`}
                      >
                        {profile.isFollowing ? (
                          <UserCheck className="h-5 w-5" />
                        ) : (
                          <UserPlus className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersList;
