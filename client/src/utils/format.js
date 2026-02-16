/**
 * Format Utilities
 * Common formatting functions
 */

// Format date
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

// Format time
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format currency (INR)
export const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Format duration (minutes to hours:minutes)
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} min`;
  }
  
  return `${hours}h ${mins}min`;
};

// Truncate text
export const truncate = (text, length = 100, suffix = '...') => {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + suffix;
};

// Capitalize first letter
export const capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Slugify text
export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
};

export default {
  formatDate,
  formatTime,
  formatCurrency,
  formatDuration,
  truncate,
  capitalize,
  slugify,
  formatFileSize,
  formatPhoneNumber,
};
