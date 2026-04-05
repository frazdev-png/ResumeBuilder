/**
 * Save Resume Button Component
 * 
 * Handles saving the current resume to MongoDB.
 * Shows save status and handles errors.
 */

import { useState } from 'react';
import { resumeApi } from '../../api/resumeApi';
import type { Resume, ResumeCreate, ResumeUpdate } from '../../types/resume';
import { Save, Check, Loader2 } from 'lucide-react';
import { useResumeStore } from '../../stores/resumeStore';

interface SaveResumeButtonProps {
  resumeId?: string;
  onSaved?: (resume: Resume) => void;
}

export function SaveResumeButton({ resumeId, onSaved }: SaveResumeButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const resumeData = useResumeStore((state) => state.formData);

  // Parse skills from comma-separated string
  const parseSkills = (skillsInput: string): string[] => {
    return skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      let savedResume: Resume;

      if (resumeId) {
        // Update existing resume
        const updateData: ResumeUpdate = {
          full_name: resumeData.fullName,
          email: resumeData.email,
          phone: resumeData.phone,
          summary: resumeData.summary,
          projects: (resumeData.projects || []).map(proj => ({
            name: proj.name,
            description: proj.description,
            url: proj.url,
            technologies: proj.technologies,
          })),
        };
        savedResume = await resumeApi.update(resumeId, updateData);
      } else {
        // Create new resume
        const newResume: ResumeCreate = {
          full_name: resumeData.fullName || 'My Resume',
          email: resumeData.email,
          phone: resumeData.phone,
          summary: resumeData.summary,
          skills: parseSkills(resumeData.skillsInput),
          experience: resumeData.experience.map(exp => ({
            company: exp.company,
            position: exp.position,
            location: exp.location,
            start_date: exp.startDate,
            end_date: exp.endDate,
            description: exp.description,
          })),
          education: resumeData.education.map(edu => ({
            institution: edu.institution,
            degree: edu.degree,
            field_of_study: edu.fieldOfStudy,
            start_date: edu.startDate,
            end_date: edu.endDate,
            description: edu.description,
          })),
          projects: (resumeData.projects || []).map(proj => ({
            name: proj.name,
            description: proj.description,
            url: proj.url,
            technologies: proj.technologies,
          })),
        };
        savedResume = await resumeApi.create(newResume);
      }

      setSaveStatus('saved');
      onSaved?.(savedResume);

      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveStatus('error');
      alert('Failed to save resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getButtonContent = () => {
    if (isSaving) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Saving...
        </>
      );
    }
    if (saveStatus === 'saved') {
      return (
        <>
          <Check className="w-4 h-4" />
          Saved!
        </>
      );
    }
    return (
      <>
        <Save className="w-4 h-4" />
        {resumeId ? 'Update' : 'Save'}
      </>
    );
  };

  return (
    <button
      onClick={handleSave}
      disabled={isSaving}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
        transition-all duration-200 shadow-sm hover:shadow-md
        ${saveStatus === 'saved' 
          ? 'bg-green-500 hover:bg-green-600 text-white' 
          : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
        }
        disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {getButtonContent()}
    </button>
  );
}
