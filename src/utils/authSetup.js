import axiosinstance from "../axios/axios";

// Setup axios interceptors for authentication
export const setupAxiosInterceptors = () => {
  // Request interceptor to add token to all requests
  axiosinstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token expiration
  axiosinstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('role');
        // Clear authorization header
        delete axiosinstance.defaults.headers.common['Authorization'];
        // Redirect to login
        window.location.href = '/Login';
      }
      return Promise.reject(error);
    }
  );
};

// Initialize auth on app startup
export const initializeAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    axiosinstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Clear auth data
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('id');
  localStorage.removeItem('role');
  delete axiosinstance.defaults.headers.common['Authorization'];
};
