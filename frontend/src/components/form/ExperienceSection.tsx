/**
 * Experience Section Component
 * 
 * Manages work experience entries with:
 * - Add new experience button
 * - List of experience cards
 * - Edit/Delete for each entry
 */

import { useState } from 'react';
import { useResumeStore } from '../../stores/resumeStore';
import type { Experience } from '../../types/resume';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { AIImproveButton } from './AIImproveButton';

// Empty experience template for new entries
const emptyExperience: Omit<Experience, 'id'> = {
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
};

export function ExperienceSection() {
  const { formData, addExperience, updateExperience, removeExperience } = useResumeStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState(emptyExperience);

  const startAdd = () => {
    setFormState(emptyExperience);
    setIsAdding(true);
    setEditingId(null);
  };

  const startEdit = (exp: Experience) => {
    setFormState({
      company: exp.company,
      position: exp.position,
      location: exp.location || '',
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      description: exp.description,
    });
    setEditingId(exp.id);
    setIsAdding(false);
  };

  const save = () => {
    // Basic validation
    if (!formState.company.trim() || !formState.position.trim()) {
      alert('Company and Position are required');
      return;
    }

    if (editingId) {
      updateExperience(editingId, formState);
      setEditingId(null);
    } else {
      addExperience(formState as Experience);
      setIsAdding(false);
    }
    setFormState(emptyExperience);
  };

  const cancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormState(emptyExperience);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      removeExperience(id);
    }
  };

  const isEditing = isAdding || editingId !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Work Experience
        </h2>
        {!isEditing && (
          <button onClick={startAdd} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        )}
      </div>

      {/* Experience Form (Add/Edit Mode) */}
      {isEditing && (
        <div className="card p-4 space-y-4 border-2 border-primary-200 dark:border-primary-800">
          <h3 className="font-medium text-gray-900 dark:text-white">
            {editingId ? 'Edit Experience' : 'Add Experience'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company *
              </label>
              <input
                type="text"
                value={formState.company}
                onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                className="input-field"
                placeholder="Company Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Position *
              </label>
              <input
                type="text"
                value={formState.position}
                onChange={(e) => setFormState({ ...formState, position: e.target.value })}
                className="input-field"
                placeholder="Job Title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formState.location}
                onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                className="input-field"
                placeholder="City, State or Remote"
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
                  placeholder="e.g. Jan 2020"
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
                  placeholder="e.g. Present"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <AIImproveButton
                section="experience"
                content={formState.description}
                onImprove={(improved) => setFormState({ ...formState, description: improved })}
              />
            </div>
            <textarea
              value={formState.description}
              onChange={(e) => setFormState({ ...formState, description: e.target.value })}
              className="input-field resize-none"
              rows={3}
              placeholder="Describe your responsibilities and achievements..."
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

      {/* Experience List */}
      <div className="space-y-3">
        {formData.experience.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No experience added yet. Click "Add Experience" to get started.
          </p>
        ) : (
          formData.experience.map((exp) => (
            <div
              key={exp.id}
              className="card p-4 flex items-start justify-between group"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {exp.position}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{exp.company}</p>
                {exp.location && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {exp.location}
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </p>
                {exp.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {exp.description}
                  </p>
                )}
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(exp)}
                  className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 
                             dark:hover:text-primary-400 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
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
