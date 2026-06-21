import axios from 'axios'

// In production this MUST point to your deployed backend's full URL
// (set VITE_API_URL in Vercel's frontend project env vars), e.g.
// https://your-backend.vercel.app/api
// In local dev it falls back to '/api' (proxied by vite.config.js) or
// directly to localhost:5000.
const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateMe: (data) => api.put('/auth/me', data),
}

// ── Products ──────────────────────────────────────────────────────────────────
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getFeatured: () => api.get('/products/featured'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
}

// ── Categories ────────────────────────────────────────────────────────────────
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
}

// ── Cart ──────────────────────────────────────────────────────────────────────
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId, quantity = 1) => api.post('/cart', { productId, quantity }),
  update: (productId, quantity) => api.put(`/cart/${productId}`, { quantity }),
  remove: (productId) => api.delete(`/cart/${productId}`),
  clear: () => api.delete('/cart'),
}

// ── Orders ────────────────────────────────────────────────────────────────────
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/myorders'),
  getById: (id) => api.get(`/orders/${id}`),
  getAll: () => api.get('/orders'),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
}

export default api