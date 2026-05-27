import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data as any;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry original request with new token
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${accessToken}`,
          };
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data as any;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data as any;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data as any;
  },
};

// Users API
export const usersAPI = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data as any;
  },

  createUser: async (userData: { email: string; password: string; role: string }) => {
    const response = await api.post('/users', userData);
    return response.data as any;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data as any;
  },
};

// Projects API
export const projectsAPI = {
  getProjects: async () => {
    const response = await api.get('/projects');
    return response.data as any;
  },

  createProject: async (projectData: {
    title: string;
    description: string;
    label: string;
    image: string;
    deploymentLink: string;
    accent: string;
  }) => {
    const response = await api.post('/projects', projectData);
    return response.data as any;
  },

  updateProject: async (projectId: string, projectData: {
    title: string;
    description: string;
    label: string;
    image: string;
    deploymentLink: string;
    accent: string;
  }) => {
    const response = await api.put(`/projects/${projectId}`, projectData);
    return response.data as any;
  },

  deleteProject: async (projectId: string) => {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data as any;
  },
};

// Team API
export const teamAPI = {
  getTeamMembers: async () => {
    const response = await api.get('/team');
    return response.data as any;
  },

  createTeamMember: async (memberData: {
    name: string;
    initials: string;
    role: string;
    bio: string;
    tools: string[];
    accent: string;
    index: string;
  }) => {
    const response = await api.post('/team', memberData);
    return response.data as any;
  },

  updateTeamMember: async (memberId: string, memberData: {
    name?: string;
    initials?: string;
    role?: string;
    bio?: string;
    tools?: string[];
    accent?: string;
    index?: string;
  }) => {
    const response = await api.put(`/team/${memberId}`, memberData);
    return response.data as any;
  },

  deleteTeamMember: async (memberId: string) => {
    const response = await api.delete(`/team/${memberId}`);
    return response.data as any;
  },
};

// Feedback API
export const feedbackAPI = {
  getFeedbacks: async () => {
    const response = await api.get('/feedback');
    return response.data as any;
  },

  getAllFeedbacks: async () => {
    const response = await api.get('/feedback/all');
    return response.data as any;
  },

  createFeedback: async (feedbackData: {
    name: string;
    email: string;
    rating: number;
    review: string;
    company?: string;
    position?: string;
    isVisible?: boolean;
  }) => {
    const response = await api.post('/feedback', feedbackData);
    return response.data as any;
  },

  updateFeedback: async (feedbackId: string, feedbackData: {
    name: string;
    email: string;
    rating: number;
    review: string;
    company?: string;
    position?: string;
    isVisible?: boolean;
  }) => {
    const response = await api.put(`/feedback/${feedbackId}`, feedbackData);
    return response.data as any;
  },

  deleteFeedback: async (feedbackId: string) => {
    const response = await api.delete(`/feedback/${feedbackId}`);
    return response.data as any;
  },
};

// Contact Settings API
export const contactSettingsAPI = {
  getContactSettings: async () => {
    const response = await api.get('/contact-settings');
    return response.data as any;
  },

  updateContactSettings: async (settingsData: {
    email: string;
    enquiryEmail: string;
    address: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  }) => {
    const response = await api.put('/contact-settings', settingsData);
    return response.data as any;
  },
};

// Contact Form API
export const contactFormAPI = {
  submitForm: async (formData: {
    name: string;
    email: string;
    project: string;
    budget?: string;
  }) => {
    const response = await api.post('/contact/submit', formData);
    return response.data as any;
  },
};

export default api;