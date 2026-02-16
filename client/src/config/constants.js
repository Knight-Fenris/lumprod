/**
 * Application Constants
 */

// Event Information
export const EVENT_INFO = {
  NAME: 'LUMIERE 2026',
  TAGLINE: 'Stories That Matter: Cinema for Social Change',
  DATES: {
    START: '2026-04-10',
    END: '2026-04-12',
    FORMATTED: 'April 10-12, 2026',
  },
  VENUE: {
    NAME: 'Punjab Engineering College',
    CITY: 'Chandigarh',
    FULL: 'Punjab Engineering College, Chandigarh',
  },
  EXPECTED_PARTICIPANTS: '500+',
  BUDGET: '₹1.96L',
  CATEGORIES_COUNT: 5,
};

// Routes
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CATEGORIES: '/categories',
  SCHEDULE: '/schedule',
  GUIDELINES: '/guidelines',
  FAQ: '/faq',
  REGISTER: '/register',
  LOGIN: '/login',
  SUBMIT: '/submit',
  DASHBOARD: '/dashboard',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  SUBMISSIONS: {
    LIST: '/submissions',
    CREATE: '/submissions',
    GET: (id) => `/submissions/${id}`,
    UPDATE: (id) => `/submissions/${id}`,
    DELETE: (id) => `/submissions/${id}`,
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/profile',
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'lumiere_auth_token',
  USER_DATA: 'lumiere_user_data',
  THEME: 'lumiere_theme',
  LANGUAGE: 'lumiere_language',
};

// Breakpoints
export const BREAKPOINTS = {
  XS: 0,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
};

// Animation Durations (ms)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// File Upload Limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 500 * 1024 * 1024, // 500MB
  ALLOWED_VIDEO_FORMATS: ['video/mp4', 'video/quicktime', 'video/x-matroska'],
  ALLOWED_IMAGE_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[6-9]\d{9}$/,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
};

// Categories
export const CATEGORIES = {
  NORTHERN_RAY: {
    id: 'northern_ray',
    name: 'The Northern Ray',
    fee: 499,
    duration: { min: 5, max: 20 },
  },
  PRISM: {
    id: 'prism',
    name: 'Prism Showcase',
    fee: 599,
    duration: { min: 5, max: 15 },
  },
  VERITE: {
    id: 'verite',
    name: 'Vérité',
    fee: 499,
    duration: { min: 8, max: 20 },
  },
  SPRINT: {
    id: 'sprint',
    name: 'Lumiere Sprint',
    fee: 200,
    duration: { min: 3, max: 7 },
  },
  VERTICAL: {
    id: 'vertical',
    name: 'Vertical Ray',
    fee: 149,
    duration: { min: 0, max: 1 },
  },
};

export default {
  EVENT_INFO,
  ROUTES,
  API_ENDPOINTS,
  STORAGE_KEYS,
  BREAKPOINTS,
  ANIMATION,
  UPLOAD_LIMITS,
  VALIDATION,
  CATEGORIES,
};
