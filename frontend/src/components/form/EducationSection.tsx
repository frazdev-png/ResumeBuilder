/**
 * Education Section Component
 * 
 * Similar to ExperienceSection but for education entries.
 * Manages degrees, institutions, and academic background.
 */

import { useState } from 'react';
import { useResumeStore } from '../../stores/resumeStore';
import type { Education } from '../../types/resume';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

const emptyEducation: Omit<Education, 'id'> = {
  institution: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  description: '',
};

export function EducationSection() {
  const { formData, addEducation, updateEducation, removeEducation } = useResumeStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState(emptyEducation);

  const startAdd = () => {
    setFormState(emptyEducation);
    setIsAdding(true);
    setEditingId(null);
  };

  const startEdit = (edu: Education) => {
    setFormState({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy || '',
      startDate: edu.startDate,
      endDate: edu.endDate || '',
      description: edu.description || '',
    });
    setEditingId(edu.id);
    setIsAdding(false);
  };

  const save = () => {
    if (!formState.institution.trim() || !formState.degree.trim()) {
      alert('Institution and Degree are required');
      return;
    }

    if (editingId) {
      updateEducation(editingId, formState);
      setEditingId(null);
    } else {
      addEducation(formState as Education);
      setIsAdding(false);
    }
    setFormState(emptyEducation);
  };

  const cancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormState(emptyEducation);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this education entry?')) {
      removeEducation(id);
    }
  };

  const isEditing = isAdding || editingId !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Education
        </h2>
        {!isEditing && (
          <button onClick={startAdd} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Education
          </button>
        )}
      </div>

      {/* Education Form */}
      {isEditing && (
        <div className="card p-4 space-y-4 border-2 border-primary-200 dark:border-primary-800">
          <h3 className="font-medium text-gray-900 dark:text-white">
            {editingId ? 'Edit Education' : 'Add Education'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Institution *
              </label>
              <input
                type="text"
                value={formState.institution}
                onChange={(e) => setFormState({ ...formState, institution: e.target.value })}
                className="input-field"
                placeholder="University Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Degree *
              </label>
              <input
                type="text"
                value={formState.degree}
                onChange={(e) => setFormState({ ...formState, degree: e.target.value })}
                className="input-field"
                placeholder="Bachelor of Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Field of Study
              </label>
              <input
                type="text"
                value={formState.fieldOfStudy}
                onChange={(e) => setFormState({ ...formState, fieldOfStudy: e.target.value })}
                className="input-field"
                placeholder="Computer Science"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="text"
                  value={formState.startDate}
                  onChange={(e) => setFormState({ ...formState, startDate: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Aug 2018"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="text"
                  value={formState.endDate}
                  onChange={(e) => setFormState({ ...formState, endDate: e.target.value })}
                  className="input-field"
                  placeholder="e.g. May 2022"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Additional Information
            </label>
            <textarea
              value={formState.description}
              onChange={(e) => setFormState({ ...formState, description: e.target.value })}
              className="input-field resize-none"
              rows={2}
              placeholder="GPA, honors, relevant coursework..."
            />
          </div>

          <div className="flex gap-2">
            <button onClick={save} className="btn-primary flex items-center gap-2">
              <Check className="w-4 h-4" />
              Save
            </button>
            <button onClick={cancel} className="btn-secondary flex items-center gap-2">
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Education List */}
      <div className="space-y-3">
        {formData.education.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No education added yet. Click "Add Education" to get started.
          </p>
        ) : (
          formData.education.map((edu) => (
            <div
              key={edu.id}
              className="card p-4 flex items-start justify-between group"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {edu.degree}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{edu.institution}</p>
                {edu.fieldOfStudy && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {edu.fieldOfStudy}
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {edu.startDate} - {edu.endDate || 'Present'}
                </p>
                {edu.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {edu.description}
                  </p>
                )}
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(edu)}
                  className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 
                             dark:hover:text-primary-400 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(edu.id)}
                  className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 
                             dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
