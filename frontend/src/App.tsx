import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useAuthStore } from './stores/authStore';
import { useResumeStore } from './stores/resumeStore';
import { ResumeForm } from './components/form/ResumeForm';
import { ResumePreview } from './components/preview/ResumePreview';
import { AuthPage } from './components/auth/AuthPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { UserMenu } from './components/auth/UserMenu';
import { ResumeList } from './components/resume/ResumeList';
import { SaveResumeButton } from './components/resume/SaveResumeButton';
import { PDFExportButton } from './components/resume/PDFExportButton';
import { CoverLetterButton } from './components/resume/CoverLetterButton';
import { ResumeScoreButton } from './components/resume/ResumeScoreButton';
import type { Resume } from './types/resume';
import './App.css';

/**
 * Main App Layout - for authenticated users
 */
function AppLayout() {
  const [currentResumeId, setCurrentResumeId] = useState<string | undefined>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { resetForm, loadResume } = useResumeStore();
  const previewRef = useRef<HTMLDivElement>(null);

  const handleLoadResume = (resume: Resume) => {
    // Convert API Resume to form data format
    const formData = {
      fullName: resume.full_name || '',
      email: resume.email || '',
      phone: resume.phone || '',
      summary: resume.summary || '',
      skillsInput: resume.skills?.join(', ') || '',
      experience: resume.experience?.map(exp => ({
        id: Math.random().toString(36).substring(2, 9),
        company: exp.company,
        position: exp.position,
        location: exp.location,
        startDate: exp.start_date,
        endDate: exp.end_date,
        description: exp.description,
      })) || [],
      education: resume.education?.map(edu => ({
        id: Math.random().toString(36).substring(2, 9),
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.field_of_study,
        startDate: edu.start_date,
        endDate: edu.end_date,
        description: edu.description,
      })) || [],
      projects: resume.projects?.map(proj => ({
        id: Math.random().toString(36).substring(2, 9),
        name: proj.name,
        description: proj.description,
        url: proj.url,
        technologies: proj.technologies,
      })) || [],
    };
    loadResume(formData);
    setCurrentResumeId(resume.id);
  };

  const handleCreateNew = () => {
    resetForm();
    setCurrentResumeId(undefined);
  };

  const handleSaved = (resume: Resume) => {
    setCurrentResumeId(resume.id);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDelete = () => {
    setCurrentResumeId(undefined);
    resetForm();
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans overflow-x-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-50/50 to-transparent -z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-[120px] -z-10 transform -translate-y-1/2 translate-x-1/3"></div>
      
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 transform hover:scale-105 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
                  ResumeAI
                </h1>
                <p className="text-sm font-medium text-blue-600">Professional Builder</p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4 flex-wrap justify-end">
              <ResumeScoreButton />
              <CoverLetterButton />
              <SaveResumeButton resumeId={currentResumeId} onSaved={handleSaved} />
              <PDFExportButton targetRef={previewRef} filename="professional-resume" />
              <div className="hidden sm:block w-px h-8 bg-gray-200 mx-1"></div>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* LeftSidebar: Saved Resumes */}
          <div className="lg:col-span-3 xl:col-span-3">
            <ResumeList 
              currentResumeId={currentResumeId}
              onLoadResume={handleLoadResume}
              onCreateNew={handleCreateNew}
              onDelete={handleDelete}
              refreshTrigger={refreshTrigger}
            />
          </div>

          {/* Middle: Editor Form */}
          <div className="lg:col-span-5 xl:col-span-4">
            <ResumeForm />
          </div>

          {/* Right: Live Preview Panel */}
          <div className="lg:col-span-4 xl:col-span-5">
            <div className="sticky top-28 xl:top-32 h-[calc(100vh-140px)] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Live Preview
                </h3>
              </div>
              <div className="overflow-y-auto w-full custom-scrollbar pb-10 flex-1">
                <ResumePreview ref={previewRef} />
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}

/**
 * Root App Component with Routing
 */
function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter 
      future={{ 
        v7_startTransition: true, 
        v7_relativeSplatPath: true 
      }}
    >
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />} 
        />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
