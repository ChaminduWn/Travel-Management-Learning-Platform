import axios from './axiosConfig';
import { LearningPlan } from '../../components/learning/LearningPlanCard';

const learningPlansApi = {
  getUserPlans: async (userId: string): Promise<LearningPlan[]> => {
    try {
      const response = await axios.get(`/learning-plans/user`, { params: { userId } });
      return response.data as LearningPlan[];
    } catch (error) {
      console.error('Error fetching user learning plans:', error);
      return [];
    }
  },
};

export default learningPlansApi;