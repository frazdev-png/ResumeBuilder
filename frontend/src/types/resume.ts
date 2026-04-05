/**
 * TypeScript types for resume data structures.
 * 
 * These types mirror the backend Pydantic models but are
 * specifically for the frontend. Keeping them in sync
 * prevents bugs when sending/receiving data.
 */

export interface Experience {
  id: string;  // Client-side ID for React keys
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
}

// Experience without id for API (snake_case to match backend)
export interface ExperienceApi {
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  description: string;
}

export interface Education {
  id: string;  // Client-side ID for React keys
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

// Education without id for API (snake_case to match backend)
export interface EducationApi {
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  technologies: string;
}

export interface ProjectApi {
  name: string;
  description: string;
  url?: string;
  technologies: string;
}

// Resume returned from API (snake_case fields)
export interface Resume {
  id?: string;
  _id?: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  summary?: string;
  skills: string[];
  experience: ExperienceApi[];
  education: EducationApi[];
  projects?: ProjectApi[];
  template?: string;
  created_at?: string;
  updated_at?: string;
}

// For creating new resume (snake_case)
export interface ResumeCreate {
  full_name: string;
  email: string;
  phone?: string;
  summary?: string;
  skills: string[];
  experience: ExperienceApi[];
  education: EducationApi[];
  projects?: ProjectApi[];
  template?: string;
}

// For updating resume (partial, snake_case)
export interface ResumeUpdate {
  full_name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills?: string[];
  experience?: ExperienceApi[];
  education?: EducationApi[];
  projects?: ProjectApi[];
  template?: string;
}

// Form state - used while editing, before saving (camelCase)
export interface ResumeFormData {
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  skillsInput: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
}

// Empty resume template for new resumes
export const emptyResume: ResumeFormData = {
  fullName: '',
  email: '',
  phone: '',
  summary: '',
  skillsInput: '',
  experience: [],
  education: [],
  projects: [],
};
