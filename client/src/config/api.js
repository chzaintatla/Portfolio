// API Configuration
// On Vercel, use relative paths for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const API_ENDPOINTS = {
  CONTACT: API_BASE_URL ? `${API_BASE_URL}/api/contact` : '/api/contact',
  MEETING: API_BASE_URL ? `${API_BASE_URL}/api/meeting/book` : '/api/meeting/book',
  HEALTH: API_BASE_URL ? `${API_BASE_URL}/api/health` : '/api/health',
};

export default API_BASE_URL;

