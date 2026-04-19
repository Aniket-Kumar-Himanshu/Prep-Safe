import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = (token) => {
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// Modules API
export const moduleAPI = {
  getAll: (disasterType) =>
    axios.get(`${API_URL}/modules`, { params: { disasterType } }),
  getById: (id) => axios.get(`${API_URL}/modules/${id}`),
  create: (data, token) =>
    axios.post(`${API_URL}/modules`, data, getAuthHeader(token)),
  complete: (id, score, token) =>
    axios.post(`${API_URL}/modules/${id}/complete`, { score }, getAuthHeader(token)),
  update: (id, data, token) =>
    axios.put(`${API_URL}/modules/${id}`, data, getAuthHeader(token)),
  delete: (id, token) =>
    axios.delete(`${API_URL}/modules/${id}`, getAuthHeader(token)),
};

// Alerts API
export const alertAPI = {
  getAll: (region, token) =>
    axios.get(`${API_URL}/alerts`, {
      params: region && region !== 'All' ? { region } : {},
      headers: { Authorization: `Bearer ${token}` }
    }),
  getById: (id) => axios.get(`${API_URL}/alerts/${id}`),
  create: (data, token) =>
    axios.post(`${API_URL}/alerts`, data, getAuthHeader(token)),
  update: (id, data, token) =>
    axios.put(`${API_URL}/alerts/${id}`, data, getAuthHeader(token)),
  delete: (id, token) =>
    axios.delete(`${API_URL}/alerts/${id}`, getAuthHeader(token)),
};

// Drills API
export const drillAPI = {
  save: (data, token) =>
    axios.post(`${API_URL}/drills`, data, getAuthHeader(token)),
  getUserResults: (token) =>
    axios.get(`${API_URL}/drills/user/results`, getAuthHeader(token)),
  createSampleData: (token) =>
    axios.post(`${API_URL}/drills/user/sample-data`, {}, getAuthHeader(token)),
  getStatistics: (token) =>
    axios.get(`${API_URL}/drills/admin/statistics`, getAuthHeader(token)),
  getAll: (token) =>
    axios.get(`${API_URL}/drills`, getAuthHeader(token)),
  create: (data, token) =>
    axios.post(`${API_URL}/drills`, data, getAuthHeader(token)),
  // Scheduled drills
  scheduleDrill: (data, token) =>
    axios.post(`${API_URL}/drills/schedule`, data, getAuthHeader(token)),
  getScheduledDrills: (token) =>
    axios.get(`${API_URL}/drills/scheduled`, getAuthHeader(token)),
  updateDrill: (id, data, token) =>
    axios.put(`${API_URL}/drills/scheduled/${id}`, data, getAuthHeader(token)),
  deleteDrill: (id, token) =>
    axios.delete(`${API_URL}/drills/scheduled/${id}`, getAuthHeader(token)),
  updateResult: (id, data, token) =>
    axios.put(`${API_URL}/drills/${id}`, data, getAuthHeader(token)),
  deleteResult: (id, token) =>
    axios.delete(`${API_URL}/drills/${id}`, getAuthHeader(token)),
};

export const virtualDrillAPI = {
  getAll: (activeOnly, token) =>
    axios.get(`${API_URL}/virtual-drills`, {
      params: activeOnly ? { activeOnly: true } : {},
      headers: { Authorization: `Bearer ${token}` },
    }),
  getById: (id, token) =>
    axios.get(`${API_URL}/virtual-drills/${id}`, getAuthHeader(token)),
  create: (data, token) =>
    axios.post(`${API_URL}/virtual-drills`, data, getAuthHeader(token)),
  update: (id, data, token) =>
    axios.put(`${API_URL}/virtual-drills/${id}`, data, getAuthHeader(token)),
  delete: (id, token) =>
    axios.delete(`${API_URL}/virtual-drills/${id}`, getAuthHeader(token)),
};

// Contacts API
export const contactAPI = {
  getAll: (type, region) =>
    axios.get(`${API_URL}/contacts`, { params: { type, region } }),
  getById: (id) => axios.get(`${API_URL}/contacts/${id}`),
  create: (data, token) =>
    axios.post(`${API_URL}/contacts`, data, getAuthHeader(token)),
  update: (id, data, token) =>
    axios.put(`${API_URL}/contacts/${id}`, data, getAuthHeader(token)),
  delete: (id, token) =>
    axios.delete(`${API_URL}/contacts/${id}`, getAuthHeader(token)),
};

// Users API
export const userAPI = {
  getProfile: (token) =>
    axios.get(`${API_URL}/users/profile`, getAuthHeader(token)),
  updateProfile: (data, token) =>
    axios.put(`${API_URL}/users/profile`, data, getAuthHeader(token)),
  getAll: (token) =>
    axios.get(`${API_URL}/users`, getAuthHeader(token)),
  getStatistics: (token) =>
    axios.get(`${API_URL}/users/admin/statistics`, getAuthHeader(token)),
  createStudent: (data) =>
    axios.post(`${API_URL}/auth/register`, { ...data, role: 'student' }),
  updateUser: (id, data, token) =>
    axios.put(`${API_URL}/users/${id}`, data, getAuthHeader(token)),
  deleteUser: (id, token) =>
    axios.delete(`${API_URL}/users/${id}`, getAuthHeader(token)),
  assignModule: (moduleId, studentIds, dueDate, token) =>
    axios.post(`${API_URL}/users/assign-module`, { moduleId, studentIds, dueDate }, getAuthHeader(token)),
};

// Quiz API
export const quizAPI = {
  create: (data, token) =>
    axios.post(`${API_URL}/quizzes`, data, getAuthHeader(token)),
  getAll: (token) =>
    axios.get(`${API_URL}/quizzes`, getAuthHeader(token)),
  getById: (id, token) =>
    axios.get(`${API_URL}/quizzes/${id}`, getAuthHeader(token)),
  update: (id, data, token) =>
    axios.put(`${API_URL}/quizzes/${id}`, data, getAuthHeader(token)),
  delete: (id, token) =>
    axios.delete(`${API_URL}/quizzes/${id}`, getAuthHeader(token)),
  submit: (data, token) =>
    axios.post(`${API_URL}/quizzes/submit`, data, getAuthHeader(token)),
  getUserResults: (token) =>
    axios.get(`${API_URL}/quizzes/user/results`, getAuthHeader(token)),
  getQuizResults: (quizId, token) =>
    axios.get(`${API_URL}/quizzes/${quizId}/results`, getAuthHeader(token)),
  getReview: (resultId, token) =>
    axios.get(`${API_URL}/quizzes/review/${resultId}`, getAuthHeader(token)),
};

// Disaster Types API
export const disasterTypeAPI = {
  getAll: (activeOnly = false) =>
    axios.get(`${API_URL}/disaster-types`, { params: { active: activeOnly } }),
  getById: (id) =>
    axios.get(`${API_URL}/disaster-types/${id}`),
  create: (data, token) =>
    axios.post(`${API_URL}/disaster-types`, data, getAuthHeader(token)),
  update: (id, data, token) =>
    axios.put(`${API_URL}/disaster-types/${id}`, data, getAuthHeader(token)),
  delete: (id, token) =>
    axios.delete(`${API_URL}/disaster-types/${id}`, getAuthHeader(token)),
  getStatistics: (token) =>
    axios.get(`${API_URL}/disaster-types/statistics`, getAuthHeader(token)),
};

// Settings API
export const settingsAPI = {
  get: (token) =>
    axios.get(`${API_URL}/settings`, getAuthHeader(token)),
  update: (data, token) =>
    axios.put(`${API_URL}/settings`, data, getAuthHeader(token)),
};
