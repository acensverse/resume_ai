'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Sparkles, Upload, AlertCircle, RefreshCw, 
  FileText, Key, Eye, EyeOff, CheckCircle2 
} from 'lucide-react';
import { extractTextFromPdf, parseResumeTextWithAi, parseResumeTextFallback } from '../utils/pdfParser';
import { ResumeData } from '../types/resume';

interface PdfImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: ResumeData) => void;
}

export default function PdfImportModal({ isOpen, onClose, onSuccess }: PdfImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<'idle' | 'reading' | 'parsing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Load key on mount/open
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const stored = localStorage.getItem('gemini_api_key') || '';
      setApiKey(stored);
      // Reset states
      setFile(null);
      setStatus('idle');
      setErrorMsg('');
      setExtractedText('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFile(selectedFiles[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      processFile(droppedFiles[0]);
    }
  };

  const processFile = async (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setStatus('error');
      setErrorMsg('Invalid file type. Please upload a valid PDF resume file.');
      return;
    }
    setFile(selectedFile);
    setErrorMsg('');
    
    // Read text from PDF first
    setStatus('reading');
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        try {
          const text = await extractTextFromPdf(arrayBuffer);
          setExtractedText(text);
          
          // Check if we already have API key to proceed with AI parser
          const storedKey = localStorage.getItem('gemini_api_key') || apiKey;
          if (storedKey.trim()) {
            runAiParser(text, storedKey.trim());
          } else {
            // Wait for key input or fallback confirmation
            setStatus('idle');
          }
        } catch (err) {
          setStatus('error');
          setErrorMsg(err instanceof Error ? err.message : 'Error extracting text from PDF pages.');
        }
      };
      reader.onerror = () => {
        setStatus('error');
        setErrorMsg('FileReader encountered an error reading the PDF file.');
      };
      reader.readAsArrayBuffer(selectedFile);
    } catch (err) {
      setStatus('error');
      setErrorMsg('Failed to process the PDF document.');
    }
  };

  const runAiParser = async (textToParse: string, keyToUse: string) => {
    if (!textToParse) return;
    setStatus('parsing');
    setErrorMsg('');
    try {
      const parsedData = await parseResumeTextWithAi(textToParse, keyToUse);
      setStatus('success');
      // Success delay for smooth UI transition
      setTimeout(() => {
        onSuccess(parsedData);
        onClose();
      }, 1000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to structure the resume layout using AI.');
    }
  };

  const runFallbackParser = () => {
    if (!extractedText) return;
    try {
      const parsedData = parseResumeTextFallback(extractedText);
      setStatus('success');
      setTimeout(() => {
        onSuccess(parsedData);
        onClose();
      }, 800);
    } catch (err) {
      setStatus('error');
      setErrorMsg('Local parser failed to parse data. Try entering a Gemini API Key.');
    }
  };

  const handleSaveKeyAndParse = () => {
    const trimmedKey = apiKey.trim();
    if (!trimmedKey) {
      setErrorMsg('Please enter a valid Gemini API Key or proceed with the basic extraction.');
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini_api_key', trimmedKey);
    }
    runAiParser(extractedText, trimmedKey);
  };

  return (
    <div className="fixed inset-0 bg-background/85 backdrop-blur-xs z-50 flex items-center justify-center p-4 sm:p-6 no-print animate-fade-in">
      <div className="bg-panel border border-border max-w-md w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col transform hover:scale-[1.005] transition-transform duration-200">
        
        {/* Modal Header */}
        <div className="p-5 bg-card border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-2.5 text-indigo-500">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <div>
              <h3 className="text-sm font-bold text-foreground">AI PDF Layout Capture</h3>
              <p className="text-[10px] text-foreground/50">Capture sections & structure from existing PDF resumes.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-panel text-foreground/50 hover:text-foreground transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* 1. Idle File Drop Zone */}
          {status === 'idle' && !extractedText && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3 ${
                isDragOver
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                  : 'border-border hover:border-indigo-500/30 bg-card hover:bg-background text-foreground/60'
              }`}
            >
              <Upload className="w-8 h-8 text-indigo-400 animate-bounce" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-foreground">Drag and drop your resume.pdf</span>
                <span className="text-[10px] text-foreground/45 block">or click to browse local files</span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
              />
            </div>
          )}

          {/* 2. Scanning / Processing state */}
          {(status === 'reading' || status === 'parsing') && (
            <div className="py-10 text-center flex flex-col items-center justify-center space-y-5 relative">
              {/* Scan effect card container */}
              <div className="relative p-6 bg-card border border-border rounded-xl w-24 h-24 flex items-center justify-center shadow-lg overflow-hidden">
                <FileText className="w-10 h-10 text-indigo-400" />
                <div className="absolute inset-x-0 ai-scan-line z-10" />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-center space-x-2">
                  <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" />
                  <span className="text-xs font-bold text-foreground">
                    {status === 'reading' ? 'Reading PDF Text...' : 'Gemini AI Segmenting Layout...'}
                  </span>
                </div>
                <p className="text-[10px] text-foreground/50">
                  {status === 'reading' 
                    ? 'Extracting raw layout segments from document pages.'
                    : 'Mapping candidate info, employment records, and typography details.'}
                </p>
              </div>
            </div>
          )}

          {/* 3. API Key Config required if file loaded and no key configured */}
          {status === 'idle' && extractedText && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 rounded-xl flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="text-[11px] leading-relaxed">
                  <p className="font-bold">Gemini API Key Required for AI Layout Capture</p>
                  <p className="text-foreground/60 mt-0.5">
                    Google Gemini key is needed to automatically structure sections (Experiences, Skills, Education) and set formatting parameters.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">Gemini API Key</label>
                  <a 
                    href="https://aistudio.google.com/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[10px] text-indigo-400 hover:underline"
                  >
                    Get free key ↗
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full pr-10 pl-3 py-2 bg-background border border-border rounded-xl text-xs text-foreground placeholder-foreground/35 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/60"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={runFallbackParser}
                  className="py-2.5 border border-border bg-card hover:bg-panel text-foreground/65 rounded-xl text-xs font-semibold hover:scale-105 active:scale-95 transition cursor-pointer"
                >
                  Basic Text Extract
                </button>
                <button
                  onClick={handleSaveKeyAndParse}
                  className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold hover:scale-105 active:scale-95 transition cursor-pointer shadow-md shadow-indigo-500/10"
                >
                  Start AI Parsing
                </button>
              </div>
            </div>
          )}

          {/* 4. Success State */}
          {status === 'success' && (
            <div className="py-8 text-center flex flex-col items-center justify-center space-y-3 animate-fade-in">
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 rounded-full">
                <CheckCircle2 className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-emerald-500">Resume Structuring Complete</h4>
                <p className="text-[10px] text-foreground/50">Applying template segments to your active workspace...</p>
              </div>
            </div>
          )}

          {/* 5. Error State */}
          {status === 'error' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl flex items-start space-x-3 text-xs leading-normal">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="font-bold">Parsing Error</p>
                  <p className="text-foreground/60">{errorMsg}</p>
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setStatus('idle');
                    setFile(null);
                    setExtractedText('');
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold hover:scale-105 active:scale-95 transition cursor-pointer"
                >
                  Retry Upload
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
