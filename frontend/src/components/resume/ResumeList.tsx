import { useState, useEffect } from 'react';
import { resumeApi } from '../../api/resumeApi';
import type { Resume } from '../../types/resume';
import { FileText, Trash2, Plus, ArrowRight, Clock } from 'lucide-react';

interface ResumeListProps {
  currentResumeId?: string;
  onLoadResume: (resume: Resume) => void;
  onCreateNew: () => void;
  refreshTrigger?: number;
  onDelete?: () => void;
}

export function ResumeList({ currentResumeId, onLoadResume, onCreateNew, refreshTrigger, onDelete }: ResumeListProps) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadResumes();
  }, [refreshTrigger]);

  const loadResumes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await resumeApi.getAll();
      setResumes(data);
    } catch (err) {
      setError('Failed to load resumes');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      setDeletingId(id);
      await resumeApi.delete(id);
      setResumes(resumes.filter(r => r.id !== id));
      onDelete?.();
    } catch (err) {
      alert('Failed to delete resume');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col sticky top-28 h-[calc(100vh-140px)]">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-gray-50/50 to-white backdrop-blur-md sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              My Resumes
            </h3>
            <p className="text-sm font-medium text-gray-500 mt-1">Manage your profiles</p>
          </div>
          <button
            onClick={onCreateNew}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Create New
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-4">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-gray-500">Loading your resumes...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium text-center">
            {error}
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mx-auto mb-6 flex items-center justify-center border border-blue-100 shadow-inner">
              <FileText className="w-10 h-10 text-blue-300" />
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">No resumes yet</h4>
            <p className="text-sm text-gray-500 max-w-[200px] mx-auto leading-relaxed">
              Create your very first professional resume to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => {
              const rId = resume._id || resume.id;
              const isActive = currentResumeId === rId;
              return (
                <div
                  key={rId}
                  onClick={() => onLoadResume(resume)}
                  className={`group relative p-5 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden
                    ${isActive 
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/20 scale-[1.02]' 
                      : 'bg-white border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1'
                    }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10 relative">
                    <div className="flex-1 min-w-0 pr-2">
                       <h4 className={`font-bold text-base truncate mb-1 transition-colors ${isActive ? 'text-white' : 'text-gray-900 group-hover:text-blue-700'}`}>
                        {resume.full_name || 'Untitled Resume'}
                       </h4>
                       <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                          <Clock className="w-3 h-3" />
                          {formatDate(resume.updated_at || resume.created_at || new Date().toISOString())}
                       </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => rId && handleDelete(rId, e)}
                        disabled={deletingId === rId}
                        className={`p-2.5 rounded-xl transition-all ${
                          isActive 
                            ? 'text-white/70 hover:text-white hover:bg-white/20' 
                            : 'text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 border border-transparent hover:border-red-100'
                        }`}
                        title="Delete Resume"
                      >
                        {deletingId === rId ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                      
                      {!isActive && (
                        <div className="bg-blue-50 p-2 rounded-xl text-blue-600 sm:opacity-0 sm:group-hover:opacity-100 transform sm:translate-x-2 sm:group-hover:translate-x-0 transition-all border border-blue-100">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
