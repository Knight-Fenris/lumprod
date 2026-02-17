import { VALIDATION } from '../config/constants';

/**
 * Validation Utilities
 * Common validation functions for forms
 */

export const validators = {
  // Email validation
  email: (value) => {
    if (!value) return 'Email is required';
    if (!VALIDATION.EMAIL_REGEX.test(value)) return 'Invalid email address';
    return null;
  },

  // Password validation
  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < VALIDATION.MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`;
    }
    if (value.length > VALIDATION.MAX_PASSWORD_LENGTH) {
      return `Password must be less than ${VALIDATION.MAX_PASSWORD_LENGTH} characters`;
    }
    return null;
  },

  // Phone validation
  phone: (value) => {
    if (!value) return 'Phone number is required';
    if (!VALIDATION.PHONE_REGEX.test(value)) {
      return 'Invalid phone number. Must be 10 digits starting with 6-9';
    }
    return null;
  },

  // Required field validation
  required: (fieldName) => (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  },

  // Min length validation
  minLength: (min) => (value) => {
    if (value && value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  },

  // Max length validation
  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return `Must be less than ${max} characters`;
    }
    return null;
  },

  // URL validation
  url: (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Invalid URL';
    }
  },

  // File size validation
  fileSize: (maxSize) => (file) => {
    if (!file) return 'File is required';
    if (file.size > maxSize) {
      return `File size must be less than ${formatFileSize(maxSize)}`;
    }
    return null;
  },

  // File type validation
  fileType: (allowedTypes) => (file) => {
    if (!file) return 'File is required';
    if (!allowedTypes.includes(file.type)) {
      return `File type must be one of: ${allowedTypes.join(', ')}`;
    }
    return null;
  },
};

// Helper to format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Compose multiple validators
export const composeValidators = (...validators) => (value) => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};

export default validators;
