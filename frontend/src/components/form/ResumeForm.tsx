import { PersonalInfoSection } from './PersonalInfoSection';
import { SkillsSection } from './SkillsSection';
import { ExperienceSection } from './ExperienceSection';
import { EducationSection } from './EducationSection';
import { ProjectsSection } from './ProjectsSection';
import { useResumeStore } from '../../stores/resumeStore';
import { RotateCcw, Sparkles } from 'lucide-react';

export function ResumeForm() {
  const resetForm = useResumeStore((state) => state.resetForm);

  const handleReset = () => {
    if (confirm('Are you sure? This will clear all your data.')) {
      resetForm();
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Editor Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-6 relative overflow-hidden sticky top-28 z-20">
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-100/50 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              Build Your Resume
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-1">
              Enter your details below to instantly generate a professional ATS-friendly layout.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Form</span>
          </button>
        </div>
      </div>

      {/* Editor Sections Container */}
      <div className="space-y-6 pb-20">
        <section className="card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
             <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
          </div>
          <PersonalInfoSection />
        </section>

        <section className="card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
             <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">2</div>
             <h2 className="text-lg font-bold text-gray-900">Core Skills</h2>
          </div>
          <SkillsSection />
        </section>

        <section className="card p-6 md:p-8">
           <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
             <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">3</div>
             <h2 className="text-lg font-bold text-gray-900">Experience</h2>
          </div>
          <ExperienceSection />
        </section>

        <section className="card p-6 md:p-8">
           <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
             <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">4</div>
             <h2 className="text-lg font-bold text-gray-900">Education</h2>
          </div>
          <EducationSection />
        </section>

        <section className="card p-6 md:p-8">
           <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
             <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold text-sm">5</div>
             <h2 className="text-lg font-bold text-gray-900">Projects</h2>
          </div>
          <ProjectsSection />
        </section>
      </div>
    </div>
  );
}
