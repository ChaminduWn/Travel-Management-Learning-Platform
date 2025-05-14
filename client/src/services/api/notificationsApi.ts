import axios from './axiosConfig';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

const notificationsApi = {
  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      // Updated path to match backend controller
      const response = await axios.get(`/api/notifications/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    try {
      // Updated path to match backend controller
      await axios.put(`/api/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },
  
  async markAllAsRead(userId: string): Promise<void> {
    try {
      // For this endpoint, you need to implement it in your backend
      // or adjust the path if it already exists
      await axios.put(`/api/notifications/${userId}/read-all`);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
};

export default notificationsApi;