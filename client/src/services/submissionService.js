import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/constants';

/**
 * Submission Service
 * Handles film submission-related API calls
 */

export const submissionService = {
  // Get all submissions
  async getSubmissions(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.SUBMISSIONS.LIST}?${queryString}`
      : API_ENDPOINTS.SUBMISSIONS.LIST;
    
    return apiClient.get(endpoint);
  },

  // Get single submission
  async getSubmission(id) {
    return apiClient.get(API_ENDPOINTS.SUBMISSIONS.GET(id));
  },

  // Create submission
  async createSubmission(submissionData) {
    return apiClient.post(API_ENDPOINTS.SUBMISSIONS.CREATE, submissionData);
  },

  // Update submission
  async updateSubmission(id, submissionData) {
    return apiClient.put(API_ENDPOINTS.SUBMISSIONS.UPDATE(id), submissionData);
  },

  // Delete submission
  async deleteSubmission(id) {
    return apiClient.delete(API_ENDPOINTS.SUBMISSIONS.DELETE(id));
  },

  // Upload film
  async uploadFilm(file, onProgress) {
    return apiClient.upload('/submissions/upload', file, onProgress);
  },
};

export default submissionService;
