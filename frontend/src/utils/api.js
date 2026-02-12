import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API,
  headers: { 'Content-Type': 'application/json' },
});

// Sections
export const getSections = () => api.get('/sections').then(r => r.data);
export const getSection = (id) => api.get(`/sections/${id}`).then(r => r.data);
export const createSection = (data) => api.post('/sections', data).then(r => r.data);
export const updateSection = (id, data) => api.put(`/sections/${id}`, data).then(r => r.data);
export const deleteSection = (id) => api.delete(`/sections/${id}`).then(r => r.data);

export const uploadBackground = (id, file) => {
  const fd = new FormData();
  fd.append('file', file);
  return api.post(`/sections/${id}/background`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};

export const uploadOverlayPhotos = (id, files) => {
  const fd = new FormData();
  files.forEach(f => fd.append('files', f));
  return api.post(`/sections/${id}/photos`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};

export const deleteOverlayPhoto = (id, index) =>
  api.delete(`/sections/${id}/photos/${index}`).then(r => r.data);

// Settings
export const getSettings = () => api.get('/settings').then(r => r.data);
export const updateSettings = (data) => api.put('/settings', data).then(r => r.data);
export const uploadMusic = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  return api.post('/settings/music', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};

// Auth
export const verifyPassword = (password) =>
  api.post('/auth/verify', { password }).then(r => r.data);

// Helpers
export const getUploadUrl = (filename) => filename ? `${API}/uploads/${filename}` : '';

export default api;
