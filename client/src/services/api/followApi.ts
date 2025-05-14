import axios from './axiosConfig';

const followApi = {
  followUser: async (followerId: string, followedId: string): Promise<void> => {
    await axios.post(`/follow/${followerId}/follow/${followedId}`);
  },

  unfollowUser: async (followerId: string, followedId: string): Promise<void> => {
    await axios.delete(`/follow/${followerId}/unfollow/${followedId}`);
  },

  getFollowers: async (userId: string): Promise<{ id: string; followerId: string; followedId: string }[]> => {
    const response = await axios.get(`/follow/${userId}/followers`);
    return response.data;
  },

  getFollowing: async (userId: string): Promise<{ id: string; followerId: string; followedId: string }[]> => {
    const response = await axios.get(`/follow/${userId}/following`);
    return response.data;
  },

  checkIsFollowing: async (followerId: string, followedId: string): Promise<boolean> => {
    try {
      const followers = await followApi.getFollowers(followedId);
      return followers.some(f => f.followerId === followerId);
    } catch {
      return false;
    }
  },
};

export default followApi;