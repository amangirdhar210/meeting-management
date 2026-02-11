const BASE_URL = 'https://api.amangirdhar.me';

export const API_CONFIG = {
  BASE_URL: BASE_URL,
} as const;

export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/login`,
  REGISTER: `${BASE_URL}/api/users/register`,
  USERS: `${BASE_URL}/api/users`,
  ROOMS: `${BASE_URL}/api/rooms`,
  BOOKINGS: `${BASE_URL}/api/bookings`,
  CHECK_AVAILABILITY: `${BASE_URL}/api/rooms/check-availability`,
} as const;
