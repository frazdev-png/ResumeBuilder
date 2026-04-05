/**
 * AI API Service
 * 
 * Handles AI-powered content improvement.
 * Called by the AIImproveButton component.
 */

import { apiClient } from './client';

export interface AIImproveRequest {
  section: 'summary' | 'experience' | 'education' | 'skills' | 'project';
  content: string;
  tone?: 'professional' | 'casual' | 'formal';
  context?: string;
}

export interface AIImproveResponse {
  improved_content: string;
  suggestions: string[];
}

export interface AICoverLetterResponse {
  cover_letter: string;
}

export interface AIResumeScoreResponse {
  score: number;
  feedback: string;
}

export const aiApi = {
  /**
   * Improve resume content using AI
   */
  async improve(request: AIImproveRequest): Promise<AIImproveResponse> {
    const response = await apiClient.post('/ai/improve', {
      ...request,
      tone: request.tone || 'professional',
    });
    return response.data;
  },

  /**
   * Check if AI service is available
   */
  async checkStatus(): Promise<{ enabled: boolean; message: string }> {
    const response = await apiClient.get('/ai/status');
    return response.data;
  },

  async generateCoverLetter(resumeData: any, targetJob?: string, targetCompany?: string): Promise<AICoverLetterResponse> {
    const response = await apiClient.post('/ai/cover-letter', {
      resume_data: resumeData,
      target_job: targetJob,
      target_company: targetCompany
    });
    return response.data;
  },

  async scoreResume(resumeData: any): Promise<AIResumeScoreResponse> {
    const response = await apiClient.post('/ai/score', resumeData);
    return response.data;
  }
};
