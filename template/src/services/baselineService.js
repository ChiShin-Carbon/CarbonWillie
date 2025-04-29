import axios from 'axios';

// For Vite applications, use import.meta.env instead of process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'; // Adjust as needed

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Service for baseline-related API calls
const BaselineService = {
  /**
   * Get the latest baseline information
   * @returns {Promise} Promise with the baseline data
   */
  getLatestBaseline: async () => {
    try {
      const response = await apiClient.get('/baseline');
      return response.data;
    } catch (error) {
      console.error('Error fetching baseline:', error);
      throw error;
    }
  },

  /**
   * Create a new baseline
   * @param {Object} baselineData - The baseline data to create
   * @returns {Promise} Promise with the created baseline
   */
  createBaseline: async (baselineData) => {
    try {
      const response = await apiClient.post('/baseline', baselineData);
      return response.data;
    } catch (error) {
      console.error('Error creating baseline:', error);
      throw error;
    }
  },

  /**
   * Update an existing baseline
   * @param {number} baselineId - The ID of the baseline to update
   * @param {Object} baselineData - The baseline data to update
   * @returns {Promise} Promise with the updated baseline
   */
  updateBaseline: async (baselineId, baselineData) => {
    try {
      const response = await apiClient.put(`/baseline/${baselineId}`, baselineData);
      return response.data;
    } catch (error) {
      console.error('Error updating baseline:', error);
      throw error;
    }
  },

  /**
   * Update the completion status of a baseline
   * @param {number} baselineId - The ID of the baseline
   * @param {boolean} isCompleted - The completion status
   * @returns {Promise} Promise with the response data
   */
  updateCompletionStatus: async (baselineId, isCompleted) => {
    try {
      const response = await apiClient.put(`/baseline/${baselineId}/complete`, {
        is_completed: isCompleted
      });
      return response.data;
    } catch (error) {
      console.error('Error updating baseline completion status:', error);
      throw error;
    }
  }
};

export default BaselineService;