import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (data) => api.post('/auth/google', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  addShippingAddress: (data) => api.post('/auth/address/shipping', data),
  addBillingAddress: (data) => api.post('/auth/address/billing', data),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getCategories: () => api.get('/products/categories/list'),
};

// Orders API
export const ordersAPI = {
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  getStats: () => api.get('/orders/stats/dashboard'),
};

// Payment API
export const paymentAPI = {
  createOrder: (data) => api.post('/payment/create-order', data),
  processGooglePay: (data) => api.post('/payment/process-googlepay', data),
  getConfig: () => api.get('/payment/config'),
  verifyPayment: (data) => api.post('/payment/verify', data),
};

// Admin Auth API (separate from customer auth)
// Uses its own token from localStorage('adminToken')
const adminApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const adminAuthAPI = {
  login: (data) => adminApi.post('/admin/auth/login', data),
  getMe: () => adminApi.get('/admin/auth/me'),
};

// Admin-scoped APIs (orders, products) using admin token
export const adminOrdersAPI = {
  getAll: (params) => adminApi.get('/orders', { params }),
  getById: (id) => adminApi.get(`/orders/${id}`),
  updateStatus: (id, data) => adminApi.put(`/orders/${id}/status`, data),
  getStats: () => adminApi.get('/orders/stats/dashboard'),
};

export const adminProductsAPI = {
  create: (data) => adminApi.post('/products', data),
  update: (id, data) => adminApi.put(`/products/${id}`, data),
  delete: (id) => adminApi.delete(`/products/${id}`),
};

export default api;
