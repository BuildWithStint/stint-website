import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
const STINT_AUTH_API_BASE_URL = process.env.NEXT_PUBLIC_STINT_AUTH_API_BASE_URL || 'http://localhost:4031';

export interface CentralAuthClient {
  clientId: string | null;
  redirectUri: string | null;
}

export interface CentralAuthUser {
  id: string;
  orgId?: string;
  email: string;
  provider: string;
  name?: string;
  picture?: string;
}

export interface CentralAuthResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresInSeconds: number;
  refreshExpiresInSeconds: number;
  user: CentralAuthUser;
  client: CentralAuthClient;
}

export interface CentralAuthRequestContext {
  clientId?: string;
  redirectUri?: string;
}

export interface ConsoleOrgMembership {
  orgId: string;
  slug: string;
  name: string;
  orgStatus: string;
  role: string;
  membershipStatus: string;
  logo?: string;
}

export interface ConsoleTokenRequest {
  email: string;
  password: string;
  orgId?: string;
  clientId?: string;
  /** Down-scope the token to this subset of held permission keys. Requires orgId. */
  permissions?: string[];
  /** Max 86400 (24h), enforced by core. */
  expiresInSeconds?: number;
}

export interface ConsoleTokenResponse {
  token: string;
  tokenType: 'Bearer';
  expiresInSeconds: number;
  user: CentralAuthUser;
  org?: { orgId: string; slug: string; name: string; role: string };
  /** Exactly what the generated token carries, so the dev can see its scope. */
  permissions: string[];
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const centralAuthApi = axios.create({
  baseURL: STINT_AUTH_API_BASE_URL,
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

export const centralAuthAPI = {
  signIn: async (email: string, password: string, context: CentralAuthRequestContext) => {
    const response = await centralAuthApi.post('/auth/signin', {
      email,
      password,
      ...context,
    });
    return response.data as CentralAuthResponse;
  },

  signUp: async (email: string, password: string, context: CentralAuthRequestContext) => {
    const response = await centralAuthApi.post('/auth/signup', {
      email,
      password,
      ...context,
    });
    return response.data as CentralAuthResponse;
  },

  getGoogleAuthUrl: async (context: CentralAuthRequestContext) => {
    const response = await centralAuthApi.get('/auth/google/url', {
      params: context,
    });
    return response.data as { url: string; state: string; client: CentralAuthClient };
  },

  refresh: async (refreshToken: string) => {
    const response = await centralAuthApi.post('/auth/refresh', { refreshToken });
    return response.data as CentralAuthResponse;
  },

  logout: async (refreshToken: string) => {
    await centralAuthApi.post('/auth/logout', { refreshToken });
  },

  errorMessage: (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data;
      if (typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string') {
        return data.error;
      }
      if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') {
        return data.message;
      }
    }
    return 'Authentication is unavailable right now.';
  },
};

// Developer API console — exchanges real credentials with the central auth
// service (core) for short-lived, optionally down-scoped access tokens.
// The endpoint is env-gated on core (auth.console.enabled) and hard-off in
// production, so this never becomes a live token-minting surface.
export const consoleAPI = {
  generateToken: async (body: ConsoleTokenRequest) => {
    const response = await centralAuthApi.post('/auth/console/token', body);
    return response.data as ConsoleTokenResponse;
  },

  getOrgs: async (token: string) => {
    const response = await centralAuthApi.get('/auth/orgs', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as { orgs: ConsoleOrgMembership[] };
  },

  getPermissions: async (token: string) => {
    const response = await centralAuthApi.get('/auth/permissions', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as { orgId: string | null; permissions: string[] };
  },

  errorMessage: (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        return 'Too many credential attempts — the console shares the sign-in throttle. Wait a minute and retry.';
      }
      const data = error.response?.data;
      if (typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string') {
        return data.error;
      }
    }
    return 'The auth service is unreachable. Is core running on its configured port?';
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
    image?: string;
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
    image?: string;
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

  submitFeedback: async (feedbackData: {
    name: string;
    email: string;
    rating: number;
    review: string;
    company?: string;
    position?: string;
  }) => {
    const response = await api.post('/feedback/submit', feedbackData);
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
    phoneNumbers?: string[];
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    gmailUser?: string;
    gmailPassword?: string;
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

// Blog API
export interface AdminBlogPost {
  _id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  coverImage?: string;
  tags: string[];
  keywords: string[];
  author: string;
  readingTime: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogInput {
  slug?: string;
  title: string;
  description: string;
  body: string;
  coverImage?: string;
  tags?: string[];
  keywords?: string[];
  author?: string;
  readingTime?: string;
  isPublished?: boolean;
  publishedAt?: string;
}

export const blogAPI = {
  list: async () => {
    const response = await api.get('/blog');
    return response.data as { success: boolean; posts: AdminBlogPost[] };
  },
  get: async (id: string) => {
    const response = await api.get(`/blog/${id}`);
    return response.data as { success: boolean; post: AdminBlogPost };
  },
  create: async (data: BlogInput) => {
    const response = await api.post('/blog', data);
    return response.data as { success: boolean; post: AdminBlogPost; error?: string };
  },
  update: async (id: string, data: Partial<BlogInput>) => {
    const response = await api.put(`/blog/${id}`, data);
    return response.data as { success: boolean; post: AdminBlogPost; error?: string };
  },
  remove: async (id: string) => {
    const response = await api.delete(`/blog/${id}`);
    return response.data as { success: boolean };
  },
  upload: async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'blog');
    const response = await api.post('/uploads', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data as {
      success: boolean;
      url?: string;
      publicId?: string;
      error?: string;
    };
  },
};

export const uploadAPI = {
  image: async (file: File, folder: 'blog' | 'projects' | 'team' = 'blog') => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', folder);
    const response = await api.post('/uploads', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data as {
      success: boolean;
      url?: string;
      publicId?: string;
      error?: string;
    };
  },
};

export default api;