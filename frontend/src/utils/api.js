import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Products
export const fetchProducts = (params) => API.get('/products', { params });
export const fetchProductById = (id) => API.get(`/products/${id}`);
export const fetchCategories = () => API.get('/products/categories');

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

// Admin
export const adminFetchProducts = (params) => API.get('/admin/products', { params });
export const adminCreateProduct = (data) => API.post('/admin/products', data);
export const adminUpdateProduct = (id, data) => API.put(`/admin/products/${id}`, data);
export const adminDeleteProduct = (id) => API.delete(`/admin/products/${id}`);
export const adminFetchStats = () => API.get('/admin/stats');

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const fetchMyOrders = () => API.get('/orders/my');
export const fetchOrderById = (id) => API.get(`/orders/${id}`);
export const adminFetchOrders = (params) => API.get('/orders', { params });
export const adminUpdateOrderStatus = (id, status) => API.patch(`/orders/${id}/status`, { status });
export const adminUpdateOrder = (id, data) => API.patch(`/orders/${id}`, data);

export default API;
