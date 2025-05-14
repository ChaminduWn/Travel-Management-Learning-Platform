import axios from './axiosConfig';
import { ProgressUpdate } from '../../type/index'; // Updated import

const mockProgressUpdates: ProgressUpdate[] = [
  {
    id: 'progress-1',
    type: 'update',
    template: 'completed_lesson',
    description: 'Completed first topic in JavaScript plan!',
    createdAt: new Date().toISOString(),
    subject: 'Photography',
    userId: '681f371376ab23580e77304c',
    planId: 'plan-1',
    percentage: 25,
    user: {
      id: '681f371376ab23580e77304c',
      name: 'User 681f371376ab23580e77304c',
      username: 'user681f371376ab23580e77304c',
      email: 'user681f@example.com',
    },
  },
  {
    id: 'progress-2',
    type: 'update',
    template: 'completed_lesson',
    description: 'Halfway through React course!',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    subject: 'Photography',
    userId: '681f371376ab23580e77304c',
    planId: 'plan-1',
    percentage: 50,
    user: {
      id: '681f371376ab23580e77304c',
      name: 'User 681f371376ab23580e77304c',
      username: 'user681f371376ab23580e77304c',
      email: 'user681f@example.com',
    },
  },
];

const progressUpdatesApi = {
  getUserProgressUpdates: async (userId: string): Promise<ProgressUpdate[]> => {
    try {
      const response = await axios.get(`/progress/user/${userId}`);
      return response.data as ProgressUpdate[];
    } catch (error) {
      console.error('Error fetching progress updates:', error);
      return mockProgressUpdates.filter((update) => update.userId === userId);
    }
  },
};

export default progressUpdatesApi;