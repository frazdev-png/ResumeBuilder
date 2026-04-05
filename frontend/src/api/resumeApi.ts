/**
 * Resume API Service
 * 
 * Handles all API calls related to resumes:
 * - Create new resume
 * - Get user's resumes
 * - Get single resume
 * - Update resume
 * - Delete resume
 */

import { apiClient } from './client';
import type { Resume, ResumeCreate, ResumeUpdate } from '../types/resume';

export const resumeApi = {
  /**
   * Create a new resume
   */
  async create(data: ResumeCreate): Promise<Resume> {
    const response = await apiClient.post('/resumes', data);
    return response.data;
  },

  /**
   * Get all resumes for current user
   */
  async getAll(): Promise<Resume[]> {
    const response = await apiClient.get('/resumes');
    return response.data;
  },

  /**
   * Get a single resume by ID
   */
  async getById(id: string): Promise<Resume> {
    const response = await apiClient.get(`/resumes/${id}`);
    return response.data;
  },

  /**
   * Update an existing resume (partial update)
   */
  async update(id: string, data: ResumeUpdate): Promise<Resume> {
    const response = await apiClient.patch(`/resumes/${id}`, data);
    return response.data;
  },

  /**
   * Delete a resume
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/resumes/${id}`);
  },
};
