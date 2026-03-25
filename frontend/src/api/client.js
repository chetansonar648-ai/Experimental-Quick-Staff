import axios from "axios";

// Use "/api" base - Vite proxy will forward to backend
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Add token to requests if available - check both token names for compatibility
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('qs_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);

export const login = (payload) => api.post("/auth/login", payload).then((res) => res.data);
export const register = (payload) => api.post("/auth/register", payload).then((res) => res.data);
export const me = () => api.get("/auth/me").then((res) => res.data);
export const logout = () => api.post("/auth/logout").then((res) => res.data);

export const fetchWorkers = () => api.get("/workers").then((res) => res.data);
export const fetchWorkerProfile = (id) => api.get(`/workers/${id}`).then((res) => res.data);
export const updateWorkerProfile = (payload) => api.put("/workers/me/profile", payload).then((res) => res.data);

export const fetchServices = () => api.get("/services").then((res) => res.data);
export const attachService = (payload) => api.post("/services/attach", payload).then((res) => res.data);
export const fetchMyServices = () => api.get("/services/me").then((res) => res.data);

export const createBooking = (payload) => api.post("/bookings", payload).then((res) => res.data);
export const fetchBookings = () => api.get("/bookings").then((res) => res.data);
export const updateBookingStatus = (id, status) => api.patch(`/bookings/${id}/status`, { status }).then((res) => res.data);

export const createReview = (payload) => api.post("/reviews", payload).then((res) => res.data);
export const fetchReviews = (userId) => api.get(`/reviews/${userId}`).then((res) => res.data);

export const fetchSavedWorkers = () => api.get("/saved-workers").then((res) => res.data);
export const saveWorker = (worker_id) => api.post("/saved-workers", { worker_id }).then((res) => res.data);
export const removeSavedWorker = (id) => api.delete(`/saved-workers/${id}`).then((res) => res.data);

export const fetchWorkerStats = () => api.get("/workers/stats").then((res) => res.data);
export const fetchWorkerJobs = (status) => api.get("/workers/jobs", { params: { status } }).then((res) => res.data);
export const updateWorkerJobStatus = (id, status) => api.patch(`/workers/jobs/${id}/status`, { status }).then((res) => res.data);
export const undoWorkerJobStatus = (id) => api.post(`/workers/jobs/${id}/undo`).then((res) => res.data);
export const saveClientFromJob = (jobId) => api.post(`/workers/jobs/${jobId}/save-client`).then((res) => res.data);
export const fetchSavedClients = () => api.get("/workers/saved-clients").then((res) => res.data);
export const fetchWorkerMe = () => api.get("/workers/me/profile").then((res) => res.data);

// Service names for title dropdown
export const fetchServiceNames = () => api.get("/services/names").then((res) => res.data);

// Profile picture upload
export const uploadProfilePicture = (formData) =>
  api.post("/workers/me/profile-picture", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then((res) => res.data);

// Change password
export const changePassword = (payload) =>
  api.post("/auth/change-password", payload).then((res) => res.data);

export default api;
