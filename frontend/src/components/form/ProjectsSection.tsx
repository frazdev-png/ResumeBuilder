import { Plus, Trash2 } from 'lucide-react';
import { useResumeStore } from '../../stores/resumeStore';

export function ProjectsSection() {
  const projects = useResumeStore((state) => state.formData.projects) || [];
  const addProject = useResumeStore((state) => state.addProject);
  const updateProject = useResumeStore((state) => state.updateProject);
  const removeProject = useResumeStore((state) => state.removeProject);

  const handleAdd = () => {
    addProject({
      id: '',
      name: '',
      description: '',
      url: '',
      technologies: '',
    });
  };

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <div key={project.id} className="p-5 border border-gray-100 bg-gray-50/50 rounded-2xl relative transition-all hover:bg-gray-50 focus-within:bg-white focus-within:border-blue-200 focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]">
          <button
            onClick={() => removeProject(project.id)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Project Name</label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject(project.id, { name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                placeholder="e.g., E-commerce Platform"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Project URL</label>
              <input
                type="url"
                value={project.url || ''}
                onChange={(e) => updateProject(project.id, { url: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Technologies Used</label>
              <input
                type="text"
                value={project.technologies}
                onChange={(e) => updateProject(project.id, { technologies: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex justify-between items-end mb-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Description</label>
              </div>
              <textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, { description: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm min-h-[100px]"
                placeholder="Describe the project, your role, and the impact..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleAdd}
        className="w-full py-4 border-2 border-dashed border-gray-200 text-gray-500 rounded-2xl font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Project
      </button>
    </div>
  );
}
