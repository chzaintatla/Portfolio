// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const API_ENDPOINTS = {
  CONTACT: `${API_BASE_URL}/api/contact`,
  MEETING: `${API_BASE_URL}/api/meeting/book`,
  HEALTH: `${API_BASE_URL}/api/health`,
};

export default API_BASE_URL;

