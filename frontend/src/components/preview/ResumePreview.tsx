import { forwardRef } from 'react';
import { useResumeStore, useSkillsArray } from '../../stores/resumeStore';
import { FileText } from 'lucide-react';

export const ResumePreview = forwardRef<HTMLDivElement>((_, ref) => {
  const formData = useResumeStore((state) => state.formData);
  const skills = useSkillsArray();

  const hasContent = 
    formData.fullName || 
    formData.email || 
    skills.length > 0 || 
    formData.experience.length > 0 || 
    formData.education.length > 0 ||
    (formData.projects?.length ?? 0) > 0;

  if (!hasContent) {
    return (
      <div ref={ref} className="bg-white shadow-2xl rounded-2xl overflow-hidden min-h-[600px] flex items-center justify-center border border-gray-200/50 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:1rem_1rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-50"></div>
        <div className="text-center p-8 relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center border border-gray-200 shadow-sm">
            <FileText className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-2xl font-black text-gray-800 mb-2 tracking-tight">Blank Canvas</h3>
          <p className="text-sm text-gray-500 font-medium max-w-sm mx-auto">
            Fill out the form on the left to instantly generate a stunning, ATS-optimized professional resume.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group perspective-1000">
      <div 
        ref={ref} 
        className="bg-white shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] rounded-none overflow-hidden max-w-[210mm] mx-auto min-h-[297mm] ring-1 ring-gray-900/5 origin-top transition-all duration-300"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* --- Premium Classic Layout Header --- */}
        <header className="px-12 py-10 border-b-2 border-gray-900 pb-8 flex flex-col items-center">
           <h1 
             className="text-[34px] font-black text-gray-900 tracking-tight uppercase leading-none mb-3"
             style={{ fontFamily: "'Playfair Display', serif" }}
           >
             {formData.fullName || 'YOUR NAME'}
           </h1>
           {/* Contact links */}
           <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-[13px] text-gray-700 font-medium tracking-wide">
             {formData.email && (
               <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                 {formData.email}
               </div>
             )}
             {formData.phone && (
               <>
                 <span className="text-gray-300">•</span>
                 <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                   {formData.phone}
                 </div>
               </>
             )}
             {/* Note: You could expand formData to have Location, LinkedIn, etc., rendered here */}
           </div>
        </header>

        {/* --- Main Content --- */}
        <div className="px-12 py-8 space-y-8">
          
          {/* Professional Summary */}
          {formData.summary && (
            <section>
              <h2 className="text-[15px] font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2 mb-3">
                Professional Profile
              </h2>
              <p className="text-[13px] text-gray-700 leading-[1.7] text-justify font-normal">
                {formData.summary}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {formData.experience.length > 0 && (
            <section>
              <h2 className="text-[15px] font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">
                Experience
              </h2>
              <div className="space-y-6">
                {formData.experience.map((exp) => (
                  <div key={exp.id} className="relative">
                    <div className="flex justify-between items-baseline mb-1 gap-4">
                      <h3 className="text-[14px] font-bold text-gray-900">
                        {exp.position}
                      </h3>
                      <div className="text-[12px] font-semibold text-gray-500 whitespace-nowrap uppercase tracking-wider">
                        {exp.startDate} – {exp.endDate || 'Present'}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                       <p className="text-[13px] font-semibold text-blue-700">{exp.company}</p>
                       {exp.location && (
                          <p className="text-[11px] font-medium text-gray-400 italic font-serif tracking-wide">{exp.location}</p>
                       )}
                    </div>
                    {exp.description && (
                      <p className="text-[13px] text-gray-700 leading-[1.6] whitespace-pre-wrap">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {formData.projects && formData.projects.length > 0 && (
            <section>
              <h2 className="text-[15px] font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">
                Projects
              </h2>
              <div className="space-y-5">
                {formData.projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[14px] font-bold text-gray-900">{proj.name}</h3>
                        {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 hover:text-blue-800 transition-colors uppercase font-bold tracking-widest">Link</a>}
                      </div>
                    </div>
                    {proj.technologies && (
                      <p className="text-[12px] font-semibold text-blue-700 mb-1">
                        Technologies: <span className="text-gray-600 font-medium">{proj.technologies}</span>
                      </p>
                    )}
                    {proj.description && (
                      <p className="text-[13px] text-gray-700 leading-[1.6] whitespace-pre-wrap mt-0.5">
                        {proj.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {formData.education.length > 0 && (
            <section>
              <h2 className="text-[15px] font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">
                Education
              </h2>
              <div className="space-y-5">
                {formData.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-[14px] font-bold text-gray-900">
                        {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                      </h3>
                      <div className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">
                         {edu.startDate} – {edu.endDate || 'Present'}
                      </div>
                    </div>
                    <p className="text-[13px] font-semibold text-blue-700 mb-1">{edu.institution}</p>
                    {edu.description && (
                      <p className="text-[13px] text-gray-600 leading-[1.6]">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-[15px] font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">
                Core Competencies
              </h2>
              <div className="flex flex-wrap gap-x-2 gap-y-1.5">
                {skills.map((skill, index) => (
                  <span key={skill} className="text-[13px] text-gray-700 font-medium">
                    {skill}{index < skills.length - 1 && <span className="text-gray-300 mx-2">•</span>}
                  </span>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
