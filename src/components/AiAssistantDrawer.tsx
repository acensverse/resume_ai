'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Key, Check, AlertCircle, RefreshCw, Eye } from 'lucide-react';
import { enhanceResumeContent } from '../utils/ai';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  type: 'bullet' | 'summary' | 'skills';
  jobTitle?: string;
  onApply: (enhancedText: string) => void;
}

export default function AiAssistantDrawer({
  isOpen,
  onClose,
  originalText,
  type,
  jobTitle = '',
  onApply
}: AiAssistantDrawerProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [enhancedText, setEnhancedText] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  // Load API key from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gemini_api_key') || '';
      setApiKey(stored);
    }
  }, [isOpen]);

  // Trigger enhancement when drawer is opened with new text
  useEffect(() => {
    if (isOpen && originalText && status === 'idle') {
      handleEnhance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, originalText]);

  // Clean up state when closing
  useEffect(() => {
    if (!isOpen) {
      setStatus('idle');
      setEnhancedText('');
      setDisplayedText('');
      setErrorMessage('');
    }
  }, [isOpen]);

  // Typewriter streaming effect
  useEffect(() => {
    if (status === 'success' && enhancedText) {
      let index = 0;
      setDisplayedText('');
      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + enhancedText.charAt(index));
        index++;
        if (index >= enhancedText.length) {
          clearInterval(interval);
        }
      }, 15); // Adjust typing speed here
      return () => clearInterval(interval);
    }
  }, [status, enhancedText]);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini_api_key', key);
    }
    setShowConfig(false);
  };

  const handleEnhance = async () => {
    setStatus('generating');
    setEnhancedText('');
    setDisplayedText('');
    setErrorMessage('');

    try {
      const result = await enhanceResumeContent(originalText, type, jobTitle);
      setEnhancedText(result);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong during enhancement.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[440px] glass-panel border-l border-border z-50 shadow-2xl flex flex-col no-print transition-all duration-300 animate-in slide-in-from-right">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/80 flex items-center justify-between bg-panel">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
          <h2 className="text-md font-semibold text-foreground tracking-wide">AI Writing Assistant</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border hover:bg-background text-foreground/60 hover:text-foreground transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Source Text Box */}
        <div className="space-y-1">
          <span className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Original Draft</span>
          <div className="p-4 rounded-xl border border-border bg-background/40 text-xs text-foreground/80 italic leading-relaxed">
            &ldquo;{originalText || 'Empty text value'}&rdquo;
          </div>
        </div>

        {/* Action Type Context */}
        {jobTitle && (
          <div className="px-3 py-1.5 border border-border/60 rounded-lg bg-background/30 text-xs text-foreground/75 flex items-center space-x-2">
            <span className="font-bold text-foreground/50">Target Role:</span>
            <span>{jobTitle}</span>
          </div>
        )}

        {/* Output Screen */}
        <div className="space-y-1 flex-1">
          <span className="text-xs font-bold text-foreground/50 uppercase tracking-widest">AI Output Suggestions</span>
          <div className="relative border border-border rounded-xl bg-background overflow-hidden min-h-36">
            {/* Scan animation */}
            {status === 'generating' && (
              <div className="absolute inset-x-0 ai-scan-line z-10" />
            )}

            <div className="p-5 text-sm leading-relaxed min-h-36">
              {status === 'generating' && (
                <div className="flex flex-col items-center justify-center h-28 space-y-2">
                  <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" />
                  <span className="text-xs text-foreground/60 animate-pulse">Consulting writing model...</span>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-start space-x-3 text-rose-500 dark:text-rose-455 text-xs p-1">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <div className="space-y-2">
                    <p className="font-semibold">Enhancement Failed</p>
                    <p className="text-foreground/60 leading-normal">{errorMessage}</p>
                    <button
                      onClick={handleEnhance}
                      className="text-xs text-indigo-500 underline hover:text-indigo-650"
                    >
                      Fallback to offline generation
                    </button>
                  </div>
                </div>
              )}

              {(status === 'success' || (status === 'idle' && enhancedText)) && (
                <div className="text-foreground font-medium">
                  <p className={status === 'success' && displayedText.length < enhancedText.length ? 'typing-caret' : ''}>
                    {displayedText}
                  </p>
                </div>
              )}

              {status === 'idle' && !originalText && (
                <div className="text-center text-foreground/40 text-xs py-10">
                  Select a section and click sparkles to start polishing.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="px-6 py-4 border-t border-border/80 bg-panel flex items-center justify-between">
        <button
          onClick={handleEnhance}
          disabled={status === 'generating' || !originalText}
          className="flex items-center space-x-1.5 text-xs text-foreground/60 hover:text-foreground disabled:opacity-40 disabled:hover:text-foreground/60 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Regenerate</span>
        </button>

        <button
          onClick={() => {
            if (enhancedText) onApply(enhancedText);
            onClose();
          }}
          disabled={status !== 'success'}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-border disabled:text-foreground/40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl shadow-lg transition duration-200"
        >
          <Check className="w-4 h-4" />
          <span>Apply to Resume</span>
        </button>
      </div>
    </div>
  );
}
