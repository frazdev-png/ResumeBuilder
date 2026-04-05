import { useState } from 'react';
import { aiApi } from '../../api/aiApi';
import { useResumeStore } from '../../stores/resumeStore';
import { FileText, Loader2, X, Copy, Check } from 'lucide-react';

export function CoverLetterButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const resumeData = useResumeStore((state) => state.formData);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await aiApi.generateCoverLetter(resumeData);
      setCoverLetter(response.cover_letter);
    } catch (err) {
      alert("Failed to generate cover letter.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all shadow-sm"
      >
        <FileText className="w-4 h-4" />
        <span className="hidden sm:inline">Cover Letter</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)}></div>
          
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-white">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-purple-600 animate-pulse">✨</span> AI Cover Letter
                </h3>
                <p className="text-sm text-gray-500 mt-1">Generate a bespoke cover letter based on your resume data.</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              {!coverLetter ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Ready to impress?</h4>
                  <p className="text-gray-500 max-w-sm mx-auto mb-6 text-sm">
                    Our AI analyzes your exact resume experience, skills, and summary to draft a highly personalized, energetic cover letter.
                  </p>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 inline-flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing your life...</>
                    ) : (
                      <>Generate Cover Letter</>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 h-full flex flex-col">
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-gray-700 whitespace-pre-wrap leading-relaxed text-sm flex-1 overflow-y-auto max-h-[50vh]">
                    {coverLetter}
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-auto">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 text-gray-500 rounded-xl font-bold hover:bg-gray-100 transition-colors text-sm"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="px-4 py-2 border border-purple-200 text-purple-700 rounded-xl font-bold hover:bg-purple-50 transition-colors text-sm"
                    >
                      Regenerate
                    </button>
                    <button
                      onClick={handleCopy}
                      className="px-5 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-md flex items-center gap-2 text-sm"
                    >
                      {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy to Clipboard</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
