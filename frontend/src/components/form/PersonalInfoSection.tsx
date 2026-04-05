/**
 * Personal Info Section Component
 * 
 * Handles the top section of the resume form:
 * - Full Name
 * - Email
 * - Phone
 * - Professional Summary
 */

import { useResumeStore } from '../../stores/resumeStore';
import { AIImproveButton } from './AIImproveButton';

export function PersonalInfoSection() {
  const { formData, setPersonalInfo } = useResumeStore();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={(e) => setPersonalInfo({ fullName: e.target.value })}
            placeholder="John Doe"
            className="input-field"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setPersonalInfo({ email: e.target.value })}
            placeholder="john@example.com"
            className="input-field"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setPersonalInfo({ phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
            className="input-field"
          />
        </div>
      </div>

      {/* Professional Summary */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="summary"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Professional Summary
          </label>
          <AIImproveButton
            section="summary"
            content={formData.summary}
            onImprove={(improved) => setPersonalInfo({ summary: improved })}
          />
        </div>
        <textarea
          id="summary"
          value={formData.summary}
          onChange={(e) => setPersonalInfo({ summary: e.target.value })}
          placeholder="Brief overview of your professional background and key strengths..."
          rows={4}
          className="input-field resize-none"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Tip: Keep it concise - 2-3 sentences that highlight your key strengths.
        </p>
      </div>
    </div>
  );
}
