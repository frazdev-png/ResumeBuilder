/**
 * Zustand store for resume state management.
 * 
 * Zustand is a lightweight state management library that:
 * - Doesn't require Provider wrappers
 * - Has excellent TypeScript support
 * - Supports persist middleware for localStorage
 * - Is much simpler than Redux
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ResumeFormData, Experience, Education, Project } from '../types/resume';
import { emptyResume } from '../types/resume';

interface ResumeState {
  // Current form data
  formData: ResumeFormData;
  
  // Actions to update form data
  setPersonalInfo: (data: Partial<Pick<ResumeFormData, 'fullName' | 'email' | 'phone' | 'summary'>>) => void;
  setSkills: (skillsInput: string) => void;
  
  // Experience actions
  addExperience: (experience: Experience) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  
  // Education actions
  addEducation: (education: Education) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  // Project actions
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  
  // Reset form
  resetForm: () => void;
  loadResume: (data: ResumeFormData) => void;
}

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useResumeStore = create<ResumeState>()(
  // persist middleware saves to localStorage automatically
  persist(
    (set) => ({
      formData: emptyResume,

      // Update personal info fields
      setPersonalInfo: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      // Update skills (stored as comma-separated string in form)
      setSkills: (skillsInput) =>
        set((state) => ({
          formData: { ...state.formData, skillsInput },
        })),

      // Experience CRUD
      addExperience: (experience) =>
        set((state) => ({
          formData: {
            ...state.formData,
            experience: [...state.formData.experience, { ...experience, id: generateId() }],
          },
        })),

      updateExperience: (id, data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            experience: state.formData.experience.map((exp) =>
              exp.id === id ? { ...exp, ...data } : exp
            ),
          },
        })),

      removeExperience: (id) =>
        set((state) => ({
          formData: {
            ...state.formData,
            experience: state.formData.experience.filter((exp) => exp.id !== id),
          },
        })),

      // Education CRUD
      addEducation: (education) =>
        set((state) => ({
          formData: {
            ...state.formData,
            education: [...state.formData.education, { ...education, id: generateId() }],
          },
        })),

      updateEducation: (id, data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            education: state.formData.education.map((edu) =>
              edu.id === id ? { ...edu, ...data } : edu
            ),
          },
        })),

      removeEducation: (id) =>
        set((state) => ({
          formData: {
            ...state.formData,
            education: state.formData.education.filter((edu) => edu.id !== id),
          },
        })),

      // Project CRUD
      addProject: (project) =>
        set((state) => ({
          formData: {
            ...state.formData,
            projects: [...state.formData.projects, { ...project, id: generateId() }],
          },
        })),

      updateProject: (id, data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            projects: state.formData.projects.map((proj) =>
              proj.id === id ? { ...proj, ...data } : proj
            ),
          },
        })),

      removeProject: (id) =>
        set((state) => ({
          formData: {
            ...state.formData,
            projects: state.formData.projects.filter((proj) => proj.id !== id),
          },
        })),

      // Reset to empty
      resetForm: () => set({ formData: emptyResume }),

      // Load existing resume data
      loadResume: (data) => set({ formData: data }),
    }),
    {
      name: 'resume-storage', // localStorage key
      partialize: (state) => ({ formData: state.formData }), // Only persist form data
    }
  )
);

// Selector to get parsed skills array from comma-separated string
export const useSkillsArray = () => {
  const skillsInput = useResumeStore((state) => state.formData.skillsInput);
  return skillsInput
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
};
