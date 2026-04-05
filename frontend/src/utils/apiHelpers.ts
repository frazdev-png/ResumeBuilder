/**
 * Helper functions to convert between form data and API format.
 * 
 * The form uses camelCase, the API uses snake_case.
 * These functions handle the conversion.
 */

import type { ResumeFormData, Resume, Experience, Education } from '../types/resume';
import type { ResumeCreate, ExperienceApi, EducationApi } from '../types/resume';

/**
 * Convert experience from form format (camelCase) to API format (snake_case)
 */
function experienceToApi(exp: Experience): ExperienceApi {
  return {
    company: exp.company,
    position: exp.position,
    location: exp.location,
    start_date: exp.startDate,
    end_date: exp.endDate,
    description: exp.description,
  };
}

/**
 * Convert education from form format (camelCase) to API format (snake_case)
 */
function educationToApi(edu: Education): EducationApi {
  return {
    institution: edu.institution,
    degree: edu.degree,
    field_of_study: edu.fieldOfStudy,
    start_date: edu.startDate,
    end_date: edu.endDate,
    description: edu.description,
  };
}

/**
 * Convert form data to API format for creating/updating resumes
 */
export function formDataToApi(formData: ResumeFormData): ResumeCreate {
  // Parse skills from comma-separated string
  const skills = formData.skillsInput
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return {
    full_name: formData.fullName,
    email: formData.email,
    phone: formData.phone || undefined,
    summary: formData.summary || undefined,
    skills,
    experience: formData.experience.map(experienceToApi),
    education: formData.education.map(educationToApi),
    template: 'default',
  };
}

/**
 * Convert API format to form format for editing
 */
export function apiToFormData(resume: Resume): ResumeFormData {
  return {
    fullName: resume.full_name,
    email: resume.email,
    phone: resume.phone || '',
    summary: resume.summary || '',
    skillsInput: resume.skills.join(', '),
    // Convert snake_case back to camelCase and add client-side IDs
    experience: resume.experience.map((exp) => ({
      id: Math.random().toString(36).substring(2, 9),
      company: exp.company,
      position: exp.position,
      location: exp.location,
      startDate: exp.start_date,
      endDate: exp.end_date,
      description: exp.description,
    })),
    education: resume.education.map((edu) => ({
      id: Math.random().toString(36).substring(2, 9),
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.field_of_study,
      startDate: edu.start_date,
      endDate: edu.end_date,
      description: edu.description,
    })),
    projects: [], // Add empty projects array
  };
}
