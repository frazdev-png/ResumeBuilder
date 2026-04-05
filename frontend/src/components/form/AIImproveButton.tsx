/**
 * AI Improvement Button Component
 * 
 * Allows users to improve resume content using AI via the backend API.
 */

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { aiApi } from '../../api/aiApi';

interface AIImproveButtonProps {
  section: 'summary' | 'experience' | 'skills';
  content: string;
  onImprove: (improvedContent: string) => void;
}

export function AIImproveButton({ section, content, onImprove }: AIImproveButtonProps) {
  const [isImproving, setIsImproving] = useState(false);

  const handleImprove = async () => {
    if (!content.trim()) {
      alert('Please add some content first before improving.');
      return;
    }

    setIsImproving(true);
    
    try {
      const result = await aiApi.improve({
        section,
        content,
        tone: 'professional',
      });
      
      onImprove(result.improved_content);
    } catch (error) {
      console.error('AI improvement failed:', error);
      alert('AI improvement failed. Please try again.');
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <button
      onClick={handleImprove}
      disabled={isImproving}
      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 
                 to-pink-600 text-white rounded-lg font-medium text-sm
                 hover:from-purple-700 hover:to-pink-700 transition-all
                 disabled:opacity-50 disabled:cursor-not-allowed
                 shadow-md hover:shadow-lg"
    >
      {isImproving ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Improving...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          Improve with AI
        </>
      )}
    </button>
  );
}
