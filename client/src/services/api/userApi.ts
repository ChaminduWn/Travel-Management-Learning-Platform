import axios from './axiosConfig';

export interface UserProfileDTO {
  id?: string;
  userId: string;
  username?: string;
  fullName: string;
  email?: string;
  bio?: string;
  profilePictureUrl?: string;
  stats?: {
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
  };
}

const userApi = {
  async getUserProfile(userId: string): Promise<UserProfileDTO> {
    try {
      const response = await axios.get(`/api/profile/${userId}`);
      return {
        id: response.data.id,
        userId: response.data.userId || userId,
        fullName: response.data.fullName || userId,
        username: response.data.username || userId,
        email: response.data.email || '',
        bio: response.data.bio || '',
        profilePictureUrl: response.data.profilePictureUrl || '',
        stats: response.data.stats || {
          totalPosts: 0,
          totalLikes: 0,
          totalComments: 0,
        },
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return {
        userId: userId,
        fullName: userId,
        username: userId,
        bio: '',
        stats: {
          totalPosts: 0,
          totalLikes: 0,
          totalComments: 0,
        },
      };
    }
  },

  async updateProfile(userId: string, profileData: Partial<UserProfileDTO>): Promise<UserProfileDTO> {
    try {
      const response = await axios.put(`/api/profile/${userId}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  async createProfile(userId: string, profileData: Partial<UserProfileDTO>): Promise<UserProfileDTO> {
    try {
      const response = await axios.post(`/api/profile/${userId}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  async deleteProfile(userId: string): Promise<void> {
    try {
      await axios.delete(`/api/profile/${userId}`);
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  },

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    try {
      await axios.put(`/api/profile/${userId}/password`, { newPassword });
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },
};

export default userApi;