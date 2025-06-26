const API_BASE_URL = 'http://localhost:5001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to make HTTP requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Authentication Methods
  async register(userData) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store token and user data
    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async getProfile() {
    return this.makeRequest('/auth/me');
  }

  async updateProfile(profileData) {
    return this.makeRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData) {
    return this.makeRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  // Form/Invoice Methods
  async getForms(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/forms?${queryString}` : '/forms';
    return this.makeRequest(endpoint);
  }

  async getForm(id) {
    return this.makeRequest(`/forms/${id}`);
  }

  async createForm(formData) {
    return this.makeRequest('/forms', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  async updateForm(id, formData) {
    return this.makeRequest(`/forms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    });
  }

  async deleteForm(id) {
    return this.makeRequest(`/forms/${id}`, {
      method: 'DELETE',
    });
  }

  async getFormStats() {
    return this.makeRequest('/forms/stats/overview');
  }

  // Utility Methods
  async healthCheck() {
    return this.makeRequest('/health', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Test connection
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      const data = await response.json();
      console.log('Backend connection test:', data);
      return data;
    } catch (error) {
      console.error('Backend connection failed:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Get token
  getToken() {
    return localStorage.getItem('token');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();

export default apiService; 