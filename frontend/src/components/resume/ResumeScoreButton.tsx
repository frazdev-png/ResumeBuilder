import { useState } from 'react';
import { aiApi } from '../../api/aiApi';
import { useResumeStore } from '../../stores/resumeStore';
import { Target, Loader2, X, Star } from 'lucide-react';

export function ResumeScoreButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [scoreData, setScoreData] = useState<{score: number, feedback: string} | null>(null);
  
  const resumeData = useResumeStore((state) => state.formData);

  const handleScore = async () => {
    setIsScoring(true);
    try {
      const response = await aiApi.scoreResume(resumeData);
      setScoreData(response);
    } catch (err) {
      alert("Failed to analyze resume.");
    } finally {
      setIsScoring(false);
    }
  };

  const getScoreColor = (sc: number) => {
    if (sc >= 80) return 'text-green-500';
    if (sc >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBgColor = (sc: number) => {
    if (sc >= 80) return 'bg-green-50 border-green-200';
    if (sc >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-all shadow-sm"
      >
        <Target className="w-4 h-4" />
        <span className="hidden sm:inline">ATS Score</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)}></div>
          
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-indigo-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Star className="text-indigo-600 w-5 h-5 fill-indigo-600" /> Rate My Resume
                </h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {!scoreData ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">ATS Readiness Check</h4>
                  <p className="text-gray-500 mb-6 text-sm">
                    Have our advanced strict ATS Analyzer grade your resume content out of 100 before you apply.
                  </p>
                  <button
                    onClick={handleScore}
                    disabled={isScoring}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all w-full flex items-center justify-center gap-2"
                  >
                    {isScoring ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Scanning...</>
                    ) : (
                      <>Run Full Scan</>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                  <div className={`p-6 rounded-2xl border ${getBgColor(scoreData.score)} text-center`}>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Overall Score</p>
                    <div className={`text-6xl font-black ${getScoreColor(scoreData.score)} drop-shadow-sm`}>
                      {scoreData.score}<span className="text-2xl text-gray-400 font-bold">/100</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Detailed Feedback</h4>
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm whitespace-pre-wrap text-gray-700 leading-relaxed max-h-64 overflow-y-auto">
                      {scoreData.feedback}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-full px-6 py-3 text-gray-500 bg-gray-50 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleScore}
                      disabled={isScoring}
                      className="w-full px-6 py-3 border-2 border-indigo-100 text-indigo-700 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
                    >
                      {isScoring ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Rescan Resume'}
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
