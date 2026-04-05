import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { CheckCircle2, X } from 'lucide-react';

type ModalType = 'login' | 'signup' | 'success' | null;

export function AuthPage() {
  const [modalType, setModalType] = useState<ModalType>(null);

  const handleSignupSuccess = () => {
    window.location.href = '/';
  };

  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] rounded-full bg-blue-400 mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] rounded-full bg-purple-400 mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[50%] rounded-full bg-pink-400 mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Hero Section */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <div className="inline-block p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl mb-6">
           <svg className="w-16 h-16 text-blue-600 drop-shadow-lg mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
           </svg>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight mb-4 drop-shadow-sm">
          AI Resume Builder
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-10 font-medium">
          Create a professional, high-impact resume in minutes using advanced AI.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => setModalType('login')}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-xl shadow-blue-500/10 border border-blue-100 hover:bg-blue-50 hover:scale-105 transition-all duration-300"
          >
            Sign In
          </button>
          <button 
            onClick={() => setModalType('signup')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
          >
            Get Started Free
          </button>
        </div>
      </div>

      {/* Modal Backdrop */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          
          <div className="absolute inset-0" onClick={() => setModalType(null)}></div>
          
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/50 animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {modalType === 'login' && (
              <LoginForm onToggleForm={() => setModalType('signup')} />
            )}
            
            {modalType === 'signup' && (
              <SignupForm 
                onToggleForm={() => setModalType('login')} 
                onSuccess={handleSignupSuccess} 
              />
            )}

            {modalType === 'success' && (
              <div className="p-10 text-center">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Registered Successfully!</h3>
                <p className="text-gray-600 mb-8">
                  Your account has been created. You can now sign in to start building your professional resume.
                </p>
                <button
                  onClick={() => setModalType('login')}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  Continue to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
