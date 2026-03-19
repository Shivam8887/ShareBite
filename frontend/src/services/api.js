import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Attach JWT to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('sharebite_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Log and handle errors centrally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err.response?.status, err.response?.data?.message || err.message);
    
    // Global 401 Unauthorized handler
    if (err.response?.status === 401 && window.location.pathname !== '/login') {
      console.warn("Unauthorized or expired token. Logging out...");
      localStorage.removeItem('sharebite_token');
      // Redirect to login only if not already on the login page
      window.location.href = '/login';
    }

    return Promise.reject(err);
  }
);

export const contactAPI = {
  sendMessage: (data) => API.post('/contact', data),
};

export default API;
