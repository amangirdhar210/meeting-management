export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
} as const;

export const API_ENDPOINTS = {
  LOGIN: `${API_CONFIG.BASE_URL}/login`,
  REGISTER: `${API_CONFIG.BASE_URL}/register`,
  USERS: `${API_CONFIG.BASE_URL}/users`,
  ROOMS: `${API_CONFIG.BASE_URL}/rooms`,
  BOOKINGS: `${API_CONFIG.BASE_URL}/bookings`,
  CHECK_AVAILABILITY: `${API_CONFIG.BASE_URL}/rooms/check-availability`,
} as const;
