import axios from './axiosConfig';

export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  oauthProvider?: string;
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await axios.get('/api/auth/status', { withCredentials: true });
    return response.data.authenticated ? response.data.user : null;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  const response = await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
  return {
    user: response.data.user,
    token: response.data.token
  };
};

export const register = async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
  const response = await axios.post('/api/auth/register', { name, email, password }, { withCredentials: true });
  return {
    user: response.data.user,
    token: response.data.token
  };
};

export const logout = async (): Promise<void> => {
  await axios.post('/api/auth/logout', {}, { withCredentials: true });
};

export const initiateOAuthLogin = (provider: 'google' | 'github'): void => {
  const url = `http://localhost:8080/oauth2/authorization/${provider}`;
  window.location.href = url; // Redirect to backend's OAuth2 endpoint
};