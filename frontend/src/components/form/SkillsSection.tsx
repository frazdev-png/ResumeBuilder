/**
 * Skills Section Component
 * 
 * Simple input for comma-separated skills.
 * Shows preview of parsed skills as badges.
 */

import { useResumeStore, useSkillsArray } from '../../stores/resumeStore';
import { X } from 'lucide-react';

export function SkillsSection() {
  const { formData, setSkills } = useResumeStore();
  const skills = useSkillsArray();

  // Remove a skill by filtering it out
  const removeSkill = (skillToRemove: string) => {
    const newSkills = skills.filter((s) => s !== skillToRemove);
    setSkills(newSkills.join(', '));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Skills
      </h2>

      <div>
        <label
          htmlFor="skills"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Skills (comma-separated)
        </label>
        <input
          type="text"
          id="skills"
          value={formData.skillsInput}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="React, TypeScript, Node.js, Python, FastAPI..."
          className="input-field"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Separate skills with commas. Click a badge below to remove it.
        </p>
      </div>

      {/* Skills Preview */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <button
              key={skill}
              onClick={() => removeSkill(skill)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 
                         text-primary-800 dark:bg-primary-900/30 dark:text-primary-300
                         rounded-full text-sm font-medium hover:bg-primary-200 
                         dark:hover:bg-primary-900/50 transition-colors group"
            >
              {skill}
              <X className="w-3 h-3 opacity-60 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
