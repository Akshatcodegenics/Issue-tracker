import axios from 'axios';

// Use /api in production by default to work on Vercel; fall back to localhost in dev
const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

export const getSseUrl = () => {
  // Use same-origin /api in production; in dev, use the explicit API base URL
  if (process.env.NODE_ENV === 'production') return '/api/events';
  return `${API_BASE_URL}/events`;
};

// Add request interceptor for better error handling
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout - please check your connection';
    } else if (error.code === 'ERR_NETWORK') {
      error.message = 'Network Error - please make sure the backend server is running on http://localhost:5000';
    } else if (!error.response) {
      error.message = 'Unable to connect to server - please check if the backend is running';
    }
    return Promise.reject(error);
  }
);

export interface Issue {
  _id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  createdAt: string;
  updatedAt: string;
}

export interface IssuesResponse {
  issues: Issue[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateIssueData {
  title: string;
  description: string;
  status?: string;
  priority?: string;
  assignee?: string;
}

export interface UpdateIssueData {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assignee?: string;
}

export interface IssueFilters {
  search?: string;
  status?: string;
  priority?: string;
  assignee?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export const issueApi = {
  // Health check
  health: () => api.get('/health'),

  // Get all issues with filters
  getIssues: (filters: IssueFilters = {}) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return api.get<IssuesResponse>(`/issues?${params.toString()}`);
  },

  // Get single issue
  getIssue: (id: string) => api.get<Issue>(`/issues/${id}`),

  // Create new issue
  createIssue: (data: CreateIssueData) => api.post<Issue>('/issues', data),

  // Update issue
  updateIssue: (id: string, data: UpdateIssueData) => api.put<Issue>(`/issues/${id}`, data),

  // Get assignees for filter dropdown
  getAssignees: () => api.get<string[]>('/assignees'),
};

export default api;