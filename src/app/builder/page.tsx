'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Sparkles, ArrowLeft, Download, Eye, EyeOff, FileJson, 
  ZoomIn, ZoomOut, RotateCcw, AlertTriangle, Printer,
  LogIn, LogOut, User, Cloud, CloudOff, Info, Check, CloudLightning, RefreshCw,
  Sun, Moon, Key, FileText, Menu, X
} from 'lucide-react';
import { ResumeData } from '../../types/resume';
import { SOFTWARE_ENGINEER_DEMO, DEMO_PRESETS, BLANK_RESUME } from '../../utils/demoData';
import ResumeForm from '../../components/ResumeForm';
import ResumePreview from '../../components/ResumePreview';
import AiAssistantDrawer from '../../components/AiAssistantDrawer';
import PdfImportModal from '../../components/PdfImportModal';
import { 
  auth, 
  loginWithGoogle, 
  logoutUser, 
  isFirebaseConfigured, 
  saveResumeToCloud, 
  getResumeFromCloud,
  savePresetsToCloud,
  getPresetsFromCloud
} from '../../utils/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function BuilderPage() {
  const [data, setData] = useState<ResumeData | null>(null);
  
  // Zoom scaling for right preview pane (1 = 100%)
  const [zoom, setZoom] = useState<number>(0.9);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) {
        setZoom(0.45);
      }
    }
  }, []);

  // Mobile viewport toggle state
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // AI Drawer state
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiInputText, setAiInputText] = useState('');
  const [aiType, setAiType] = useState<'bullet' | 'summary' | 'skills'>('bullet');
  const [aiPath, setAiPath] = useState<string | null>(null);

  // Firebase auth & sync states
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [firebaseActive, setFirebaseActive] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error' | 'offline'>('offline');
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [conflictResume, setConflictResume] = useState<ResumeData | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Theme & Profile Fallback states
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [photoFailed, setPhotoFailed] = useState(false);



  // Close dropdown on click outside
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  // Custom confirmation / alert modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: (inputValue?: string) => void;
    onCancel?: () => void;
    isAlertOnly?: boolean;
    hasInput?: boolean;
    inputPlaceholder?: string;
    initialInputValue?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  const [modalInputValue, setModalInputValue] = useState('');

  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);
  const [savedPresets, setSavedPresets] = useState<Array<{ id: string; label: string; data: ResumeData; updatedAt: string }>>([]);
  const [isPdfImportOpen, setIsPdfImportOpen] = useState(false);
  const [geminiKey, setGeminiKey] = useState('');
    const [showGeminiKey, setShowGeminiKey] = useState(false);

  // Load custom presets and API key on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      
      const storedKey = localStorage.getItem('gemini_api_key');
      if (storedKey) setGeminiKey(storedKey);
    }
  }, []);

  const handleSaveGeminiKey = () => {
    if (typeof window !== 'undefined') {
      if (geminiKey.trim() === '') {
        localStorage.removeItem('gemini_api_key');
        showAlert('API Key Removed', 'Your Gemini API key has been cleared from local storage.');
      } else {
        localStorage.setItem('gemini_api_key', geminiKey.trim());
        showAlert('API Key Saved', 'Your Gemini API key has been securely saved locally.');
      }
    }
  };

  const [loadedPresetLabel, setLoadedPresetLabel] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('loaded_preset_label') || 'Load Preset';
    }
    return 'Load Preset';
  });

  const updatePresetLabel = (label: string) => {
    setLoadedPresetLabel(label);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('loaded_preset_label', label);
    }
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void, confirmText = 'Confirm') => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText: 'Cancel',
      onConfirm: () => {
        onConfirm();
        closeConfirmModal();
      },
      onCancel: closeConfirmModal,
      isAlertOnly: false,
      hasInput: false,
    });
  };

  const showConfirmWithInput = (
    title: string,
    message: string,
    onConfirm: (val: string) => void,
    placeholder = 'Enter name...',
    initialVal = '',
    confirmText = 'Confirm'
  ) => {
    setModalInputValue(initialVal);
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText: 'Cancel',
      onConfirm: (val) => {
        onConfirm(val || '');
        closeConfirmModal();
      },
      onCancel: closeConfirmModal,
      isAlertOnly: false,
      hasInput: true,
      inputPlaceholder: placeholder,
      initialInputValue: initialVal,
    });
  };

  const showAlert = (title: string, message: string, onConfirm?: () => void) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText: 'OK',
      onConfirm: () => {
        if (onConfirm) onConfirm();
        closeConfirmModal();
      },
      isAlertOnly: true,
      hasInput: false,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    // Sync theme state on mount
    let initialTheme: 'light' | 'dark' = 'dark';
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') {
        initialTheme = saved;
      } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        initialTheme = 'light';
      }
    }
    setTheme(initialTheme);
    if (initialTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.theme = 'dark';
    }
  };

  useEffect(() => {
    setPhotoFailed(false);
  }, [user]);
  
  // Refs to control initial render sync locks
  const isInitialLoad = useRef(true);
  const skipNextSync = useRef(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial Load of Local Data & Firebase config status
  useEffect(() => {
    const active = isFirebaseConfigured();
    setFirebaseActive(active);

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('resume_builder_data');
      if (saved) {
        try {
          setData(JSON.parse(saved));
        } catch {
          setData(SOFTWARE_ENGINEER_DEMO);
        }
      } else {
        setData(SOFTWARE_ENGINEER_DEMO);
      }
    }
  }, []);

  // 2. Firebase Auth Listener & Sync Coordinator
  useEffect(() => {
    if (!firebaseActive || !auth) {
      setLoadingAuth(false);
      setSyncStatus('offline');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoadingAuth(false);
      if (!firebaseUser) {
        setSavedPresets([]);
      }

      if (firebaseUser) {
        setSyncStatus('synced');
        try {
          // Fetch from cloud
          const cloudData = await getResumeFromCloud(firebaseUser.uid);
          
          if (cloudData) {
            // Get current local data to compare
            const savedLocal = typeof window !== 'undefined' ? localStorage.getItem('resume_builder_data') : null;
            const currentLocal = savedLocal ? JSON.parse(savedLocal) : data;

            // Check if different (compare JSON strings, ignoring minor whitespace differences)
            if (currentLocal && JSON.stringify(cloudData) !== JSON.stringify(currentLocal)) {
              // Trigger conflict modal
              setConflictResume(cloudData);
            } else {
              // Sync is same
              setSyncStatus('synced');
            }
          } else {
            // User has no cloud resume, upload the current local state immediately
            const savedLocal = typeof window !== 'undefined' ? localStorage.getItem('resume_builder_data') : null;
            const dataToUpload = savedLocal ? JSON.parse(savedLocal) : data;
            
            if (dataToUpload) {
              setSyncStatus('saving');
              await saveResumeToCloud(firebaseUser.uid, dataToUpload);
              setSyncStatus('synced');
            }
          }
          
          try {
            const cloudPresets = await getPresetsFromCloud(firebaseUser.uid);
            if (cloudPresets && cloudPresets.length > 0) {
              setSavedPresets(cloudPresets);
            }
          } catch (presetErr) {
            console.error('Failed to load presets from cloud:', presetErr);
          }
        } catch (err) {
          console.error('Error synchronizing with cloud on login:', err);
          setSyncStatus('error');
        }
      } else {
        setSyncStatus('offline');
      }
    });

    return () => unsubscribe();
  }, [firebaseActive]);

  // 3. Debounced Auto-saving to Cloud & Local Storage
  useEffect(() => {
    if (!data) return;

    // Skip the absolute first state setup sync
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // Always save to localStorage immediately for offline safety
    if (typeof window !== 'undefined') {
      localStorage.setItem('resume_builder_data', JSON.stringify(data));
    }

    // Skip sync if flagged (e.g. just resolved a conflict, loaded a template, or loaded cloud data)
    if (skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }

    // Only process Cloud Auto-saving if logged in & Firebase is configured
    if (user && firebaseActive) {
      setSyncStatus('saving');

      // Clear previous timer
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      // Start 3-second debounce timer
      syncTimeoutRef.current = setTimeout(async () => {
        try {
          await saveResumeToCloud(user.uid, data);
          setSyncStatus('synced');
        } catch (err) {
          console.error('Failed to auto-save to Firebase:', err);
          setSyncStatus('error');
        }
      }, 3000);
    }

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [data, user, firebaseActive]);

  // Handle Login Call
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        showAlert('Sign-in Failed', 'Google Sign-in failed. Please verify your environment setup.');
      }
    }
  };

  // Handle Logout Call
  const handleLogout = async () => {
    showConfirm(
      'Sign Out',
      'Are you sure you want to sign out? Your changes will remain saved locally.',
      async () => {
        try {
          await logoutUser();
          setSyncStatus('offline');
        } catch (err) {
          console.error('Logout failed:', err);
        }
      }
    );
  };

  // Manually Load Cloud Resume
  const handleLoadCloudResumeManually = async () => {
    if (!user || !firebaseActive) return;
    setShowUserDropdown(false);
    setSyncStatus('saving');
    try {
      const cloudData = await getResumeFromCloud(user.uid);
      if (cloudData) {
        skipNextSync.current = true;
        setData(cloudData);
        if (typeof window !== 'undefined') {
          localStorage.setItem('resume_builder_data', JSON.stringify(cloudData));
        }
        showAlert('Success', 'Your cloud resume has been successfully loaded into the editor.');
      } else {
        showAlert('No Cloud Data', 'No resume data found in your cloud account.');
      }
      setSyncStatus('synced');
    } catch (err) {
      console.error(err);
      setSyncStatus('error');
      showAlert('Error', 'Failed to load resume from the cloud.');
    }
  };

  // Conflict Resolution: Choose Cloud Data
  const resolveConflictWithCloud = () => {
    if (!conflictResume) return;
    
    skipNextSync.current = true;
    setData(conflictResume);
    if (typeof window !== 'undefined') {
      localStorage.setItem('resume_builder_data', JSON.stringify(conflictResume));
    }
    setConflictResume(null);
    setSyncStatus('synced');
  };

  // Conflict Resolution: Overwrite Cloud with Local Data
  const resolveConflictWithLocal = async () => {
    if (!user || !data) return;
    
    setConflictResume(null);
    setSyncStatus('saving');
    try {
      await saveResumeToCloud(user.uid, data);
      setSyncStatus('synced');
    } catch (err) {
      console.error('Failed to resolve cloud sync override:', err);
      setSyncStatus('error');
    }
  };

  // Trigger data edits
  const handleDataChange = (newData: ResumeData) => {
    setData(newData);
  };

  // Trigger AI assistant drawer
  const handleEnhanceTrigger = (
    text: string, 
    type: 'bullet' | 'summary' | 'skills', 
    index: number, 
    path: string
  ) => {
    setAiInputText(text);
    setAiType(type);
    setAiPath(path);
    setAiDrawerOpen(true);
  };

  // Apply enhanced text from assistant back into state
  const handleApplyAiEnhancement = (enhancedText: string) => {
    if (!data || !aiPath) return;

    const updated = { ...data };
    const segments = aiPath.split('.');

    if (segments[0] === 'personalInfo' && segments[1] === 'summary') {
      updated.personalInfo.summary = enhancedText;
    } else if (segments[0] === 'experiences') {
      const expIdx = parseInt(segments[1]);
      const bulletIdx = parseInt(segments[3]);
      updated.experiences[expIdx].bullets[bulletIdx] = enhancedText;
    } else if (segments[0] === 'projects') {
      const projIdx = parseInt(segments[1]);
      const bulletIdx = parseInt(segments[3]);
      updated.projects[projIdx].bullets[bulletIdx] = enhancedText;
    } else if (segments[0] === 'skills') {
      const skillIdx = parseInt(segments[1]);
      const skillItems = enhancedText.split(',').map(s => s.trim()).filter(Boolean);
      updated.skills[skillIdx].items = [...new Set([...updated.skills[skillIdx].items, ...skillItems])];
    }

    handleDataChange(updated);
    setAiDrawerOpen(false);
    setAiPath(null);
  };

  // Download PDF via Browser Print
  const handlePrint = () => {
    window.print();
  };

  // Export JSON file backup
  const handleExportJson = () => {
    if (!data) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `${data.personalInfo.name.toLowerCase().replace(/\s+/g, '_') || 'resume'}_backup.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Manually save to cloud
  const handleManualCloudSave = async () => {
    if (!user || !firebaseActive) {
      showAlert('Login Required', 'Please log in with your Google account to save your resume directly to the cloud database.');
      return;
    }
    if (!data) return;
    
    setSyncStatus('saving');
    try {
      await saveResumeToCloud(user.uid, data);
        setSyncStatus('synced');
        
        // Also auto-save as preset
        const newPreset = {
          id: `preset-${Date.now()}`,
          label: `Draft (${new Date().toLocaleString()})`,
          data: data,
          updatedAt: new Date().toLocaleDateString()
        };
        const updatedPresets = [...savedPresets, newPreset];
        setSavedPresets(updatedPresets);
        await savePresetsToCloud(user.uid, updatedPresets);
        
        showAlert('Saved to Cloud', 'Your resume has been successfully saved to your cloud account and added to your presets.');
    } catch (err) {
      console.error('Failed to save manually:', err);
      setSyncStatus('error');
      showAlert('Save Failed', 'There was an error saving your resume to the cloud.');
    }
  };

  // Load alternative presets in-place
  const handlePresetClick = (val: string) => {
    const selected = DEMO_PRESETS[val];
    if (!selected) return;
    
    setIsPresetsModalOpen(false);

    if (val === 'blank') {
      showConfirmWithInput(
        'Create Blank Template',
        'This will clear your current progress and start fresh. Enter a name for your new blank draft:',
        (customName) => {
          const finalName = customName.trim() || 'Blank Resume';
          if (user && firebaseActive) {
            setSyncStatus('saving');
          }
          handleDataChange(BLANK_RESUME);
          updatePresetLabel(finalName);
        },
        'e.g. My Custom Resume',
        'Blank Resume',
        'Create Blank'
      );
    } else {
      showConfirm(
        'Overwrite Current Draft',
        `This will overwrite your current draft. Do you want to load the ${selected.label} template?`,
        () => {
          // Flag to prevent immediate save triggers while swapping template
          if (user && firebaseActive) {
            setSyncStatus('saving');
          }
          handleDataChange(selected.data);
          updatePresetLabel(selected.label);
        },
        'Load Template'
      );
    }
  };

  // Reset state to empty blank canvas
  const handleReset = () => {
    showConfirmWithInput(
      'Clear Canvas',
      'Are you sure you want to clear your current progress and start fresh? Enter a name for this blank draft:',
      (customName) => {
        const finalName = customName.trim() || 'Blank Resume';
        const blankData = BLANK_RESUME;

        // Auto-save blank canvas as a custom preset
        const newPreset = {
          id: `preset-${Date.now()}`,
          label: finalName,
          data: blankData,
          updatedAt: new Date().toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        const updated = [...savedPresets, newPreset];
        setSavedPresets(updated);
        if (user && firebaseActive) {
            savePresetsToCloud(user.uid, updated).catch(console.error);
          } else {
            showAlert('Login Required', 'Please log in with Google to save presets to your cloud account.');
          }

        if (user && firebaseActive) {
          setSyncStatus('saving');
        }
        handleDataChange(blankData);
        updatePresetLabel(finalName);
      },
      'e.g. Reset Draft',
      'Blank Resume',
      'Clear Canvas'
    );
  };

  // Rename active preset
  const handleRenamePreset = () => {
    setIsPresetsModalOpen(false);
    showConfirmWithInput(
      'Rename Preset',
      'Enter a new name for the active preset:',
      (newName) => {
        const finalName = newName.trim() || 'Custom Resume';
        updatePresetLabel(finalName);
      },
      'e.g. My Custom Resume',
      loadedPresetLabel,
      'Rename'
    );
  };

  // Load custom user preset
  const handleLoadCustomPreset = (preset: { id: string; label: string; data: ResumeData }) => {
    setIsPresetsModalOpen(false);
    showConfirm(
      'Load Saved Preset',
      `This will overwrite your current draft. Do you want to load "${preset.label}"?`,
      () => {
        if (user && firebaseActive) {
          setSyncStatus('saving');
        }
        handleDataChange(preset.data);
        updatePresetLabel(preset.label);
      },
      'Load Preset'
    );
  };

  // Save current resume as custom preset
  const saveCurrentAsPreset = () => {
    if (!data) return;
    setIsPresetsModalOpen(false);
    showConfirmWithInput(
      'Save Current Draft as Preset',
      'Enter a name for this custom preset:',
      (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const newPreset = {
          id: `preset-${Date.now()}`,
          label: trimmed,
          data: data,
          updatedAt: new Date().toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        const updated = [...savedPresets, newPreset];
        setSavedPresets(updated);
        if (user && firebaseActive) {
            savePresetsToCloud(user.uid, updated).catch(console.error);
          } else {
            showAlert('Login Required', 'Please log in with Google to save presets to your cloud account.');
          }
        updatePresetLabel(trimmed);
        showAlert('Preset Saved', `Successfully saved preset: "${trimmed}"`);
      },
      'e.g. Senior Frontend Resume',
      '',
      'Save Preset'
    );
  };

  // Rename a saved custom preset
  const renameCustomPreset = (id: string, currentLabel: string) => {
    showConfirmWithInput(
      'Rename Preset',
      'Enter a new name for this preset:',
      (newName) => {
        const trimmed = newName.trim();
        if (!trimmed || trimmed === currentLabel) return;
        const updated = savedPresets.map(p => p.id === id ? { ...p, label: trimmed } : p);
        setSavedPresets(updated);
        if (user && firebaseActive) {
          savePresetsToCloud(user.uid, updated).catch(console.error);
        } else {
          showAlert('Login Required', 'Please log in with Google to save presets to your cloud account.');
        }
        showAlert('Preset Renamed', `Successfully renamed to: "${trimmed}"`);
      },
      'e.g. My Updated Tech Resume',
      currentLabel,
      'Rename'
    );
  };

  // Delete a saved custom preset
  const deleteCustomPreset = (id: string, label: string) => {
    showConfirm(
      'Delete Custom Preset',
      `Are you sure you want to permanently delete the custom preset "${label}"?`,
      () => {
        const updated = savedPresets.filter(p => p.id !== id);
        setSavedPresets(updated);
        if (user && firebaseActive) {
            savePresetsToCloud(user.uid, updated).catch(console.error);
          } else {
            showAlert('Login Required', 'Please log in with Google to save presets to your cloud account.');
          }
      },
      'Delete'
    );
  };

  // Zoom helpers
  const zoomIn = () => setZoom(prev => Math.min(prev + 0.05, 1.2));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.05, 0.6));

  if (!data) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-foreground/50 text-xs animate-pulse">Initializing editor workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full min-h-screen flex flex-col bg-background text-foreground relative select-none transition-colors duration-200 print:block print:min-h-0">
      
      {/* 1. TOP HEADER NAVIGATION BLOCK */}
      <header className="fixed top-0 inset-x-0 h-16 shrink-0 bg-panel border-b border-border px-6 flex items-center justify-between no-print z-50 transition-colors duration-200">
        {/* Logo and Back */}
        <div className="flex items-center space-x-4 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight text-[var(--foreground)] hidden lg:inline">ResumeAI Workspace</span>
          </div>

          {/* Sync Status Badge */}
          <div className="hidden sm:block">
            {syncStatus === 'synced' && (
              <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Synced</span>
              </span>
            )}
            {syncStatus === 'saving' && (
              <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                <RefreshCw className="w-3 h-3 animate-spin text-indigo-600 dark:text-indigo-400" />
                <span>Syncing...</span>
              </span>
            )}
            {syncStatus === 'error' && (
              <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-450 text-xs font-semibold">
                <CloudOff className="w-3 h-3 text-rose-600 dark:text-rose-450" />
                <span>Sync Error</span>
              </span>
            )}
            {syncStatus === 'offline' && (
              <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-card border border-border text-foreground/50 text-xs font-semibold">
                <CloudOff className="w-3 h-3" />
                <span>Offline Sandbox</span>
              </span>
            )}
          </div>
        </div>

        {/* Global Toolbar & Auth options */}
        <div className="flex items-center space-x-2.5 z-40 ml-auto">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-border bg-card hover:bg-panel text-foreground/80 hover:text-foreground transition cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className={`
            absolute top-16 left-0 w-full bg-panel border-b border-border shadow-2xl p-4 flex-col space-y-3 z-30
            md:static md:w-auto md:bg-transparent md:border-none md:shadow-none md:p-0 md:flex-row md:space-y-0 md:flex md:items-center md:space-x-2.5
            ${mobileMenuOpen ? 'flex' : 'hidden md:flex'}
          `}>
            {/* Presets & Templates Trigger Button */}
            <button
              onClick={() => { setIsPresetsModalOpen(true); setMobileMenuOpen(false); }}
              className="flex items-center justify-between md:justify-center space-x-1.5 w-full md:w-auto px-3.5 py-2.5 md:py-2 rounded-xl border border-border bg-card hover:bg-panel text-foreground/80 hover:text-foreground text-xs font-bold hover:scale-[1.03] active:scale-[0.97] hover:shadow-sm transition-all duration-200 cursor-pointer"
              title="Manage Presets & Templates"
            >
              <span>{loadedPresetLabel}</span>
              <span className="text-[10px] opacity-60">📁</span>
            </button>

            {/* Reset button */}
            <button
              onClick={() => { handleReset(); setMobileMenuOpen(false); }}
              className="group/reset flex items-center justify-center space-x-2 w-full md:w-auto p-2.5 md:p-2 rounded-xl border border-border bg-card hover:bg-panel text-foreground/60 hover:text-foreground hover:scale-110 active:scale-90 hover:shadow-sm transition-all duration-200 cursor-pointer"
              title="Reset Canvas"
            >
              <RotateCcw className="w-4 h-4 transition-transform duration-300 group-hover/reset:-rotate-180" />
              <span className="md:hidden text-xs font-bold">Reset Canvas</span>
            </button>

            {/* Save to Cloud */}
            <button
              onClick={() => { saveCurrentAsPreset(); setMobileMenuOpen(false); }}
              className="group/cloud flex items-center justify-center space-x-1.5 w-full md:w-auto px-3 py-2.5 md:py-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              title="Save to Cloud Account"
            >
              <Cloud className="w-3.5 h-3.5 transition-transform group-hover/cloud:-translate-y-0.5" />
              <span className="inline md:hidden lg:inline">Save</span>
            </button>

            {/* Export JSON */}
            <button
              onClick={() => { handleExportJson(); setMobileMenuOpen(false); }}
              className="group/backup flex items-center justify-center space-x-1.5 w-full md:w-auto px-3 py-2.5 md:py-2 rounded-xl border border-border bg-card hover:bg-panel text-foreground/60 hover:text-foreground text-xs font-semibold hover:scale-105 active:scale-95 hover:shadow-sm transition-all duration-200 cursor-pointer"
              title="Export JSON Backup"
            >
              <FileJson className="w-3.5 h-3.5 transition-transform group-hover/backup:-translate-y-0.5" />
              <span className="inline md:hidden lg:inline">Backup</span>
            </button>

            {/* Print PDF Button */}
            <button
              onClick={() => { handlePrint(); setMobileMenuOpen(false); }}
              className="group/pdf flex items-center justify-center space-x-1.5 w-full md:w-auto px-3.5 py-2.5 md:py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 transition-transform group-hover/pdf:scale-110" />
              <span className="inline md:hidden lg:inline">Export PDF</span>
            </button>

            <div className="h-px md:h-4 w-full md:w-px bg-border" />

            {/* Theme Switcher Button */}
            <button
              onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
              className="group/theme flex items-center justify-center space-x-2 w-full md:w-auto p-2.5 md:p-2 rounded-xl border border-border bg-card hover:bg-panel text-foreground/60 hover:text-foreground hover:scale-110 active:scale-90 hover:shadow-sm transition-all duration-200 cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 transition-transform duration-500 group-hover/theme:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 transition-transform duration-500 group-hover/theme:-rotate-12" />
              )}
              <span className="md:hidden text-xs font-bold">Toggle Theme</span>
            </button>

            <div className="h-px md:h-4 w-full md:w-px bg-border" />

            {/* Auth Header User Section */}
            <div className="flex items-center justify-center relative w-full md:w-auto pt-2 md:pt-0">
              {loadingAuth ? (
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              ) : user ? (
                <div className="flex items-center space-x-2 w-full md:w-auto justify-center">
                  {/* Static user display */}
                  <div className="flex items-center justify-center space-x-2 p-1.5 rounded-xl border border-border bg-card w-full md:w-auto cursor-pointer" onClick={() => setShowUserDropdown(!showUserDropdown)}>
                    {!photoFailed && user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="User Profile" 
                        className="w-7.5 h-7.5 rounded-xl border border-border shrink-0"
                        onError={() => setPhotoFailed(true)}
                      />
                    ) : (
                      <div className="w-7.5 h-7.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-400 shrink-0">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-bold text-[var(--foreground)] inline max-w-28 truncate">
                      {user.displayName || 'User'}
                    </span>
                  </div>
                  {/* User Dropdown */}
                  {showUserDropdown && (
                    <div className="absolute right-0 md:right-0 top-full mt-2 w-full md:w-48 bg-card border border-border rounded-xl shadow-lg py-1 overflow-hidden animate-fade-in z-50">
                      <button
                        onClick={() => { handleLoadCloudResumeManually(); setMobileMenuOpen(false); }}
                        className="w-full px-4 py-3 md:py-2 text-left text-xs font-semibold text-foreground/80 hover:bg-indigo-500/10 hover:text-indigo-500 flex items-center space-x-2 transition cursor-pointer"
                      >
                        <Cloud className="w-4 h-4" />
                        <span>Load Cloud Resume</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full px-4 py-3 md:py-2 text-left text-xs font-semibold text-foreground/80 hover:bg-rose-500/10 hover:text-rose-500 flex items-center space-x-2 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                firebaseActive && (
                  <button
                    onClick={() => { handleLogin(); setMobileMenuOpen(false); }}
                    className="flex items-center justify-center space-x-1.5 w-full md:w-auto px-3 py-2.5 md:py-1.5 border border-indigo-500/30 hover:border-indigo-500/60 bg-indigo-500/10 rounded-lg text-indigo-400 hover:text-indigo-300 text-xs font-bold transition duration-200 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Google Login</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. SPLIT WORKSPACE WINDOW CONTAINER */}
      <div className="flex-grow w-full flex pt-16 print:pt-0">
        
        {/* LEFT COLUMN: EDITOR FORM (Width: 45%) */}
        <aside className={`w-full md:w-[45%] border-r border-border bg-panel p-6 no-print editor-sidebar transition-colors duration-200 min-h-[calc(100vh-4rem)] ${mobileView === 'form' ? 'block' : 'hidden md:block'}`}>
          <div className="max-w-2xl mx-auto space-y-4 pb-28">
            
            {/* Firebase setup helper notification if credentials aren't initialized */}
            {!firebaseActive && (
              <div className="mb-2 p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 flex items-start space-x-3 text-amber-600 dark:text-amber-500 animate-fade-in">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="text-xs space-y-1">
                  <p className="font-bold">Cloud Syncing Disabled</p>
                  <p className="leading-normal text-foreground/60">
                    To enable database auto-saving and access your resume from any device, configure your Firebase credentials in a <code className="bg-card px-1.5 py-0.5 rounded border border-border text-xs">.env.local</code> file in your workspace. Until then, you are in <b>Local Sandbox Mode</b> saving edits locally.
                  </p>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)] tracking-wide">Resume Blueprint</h2>
              <p className="text-xs text-foreground/60 mt-0.5 leading-normal">
                Edit your personal, job, education details, and click sparkles to refine achievements using our AI engine.
              </p>
            </div>
            
            <ResumeForm 
              data={data} 
              onChange={handleDataChange} 
              onEnhance={handleEnhanceTrigger}
              isEnhancingPath={aiPath}
            />
          </div>
        </aside>

        {/* RIGHT COLUMN: LIVE CANVAS PREVIEW (Width: 55%) */}
        <main className={`flex-col md:w-[55%] print:w-full flex-1 bg-background relative transition-colors duration-200 sticky top-0 h-screen overflow-hidden print:static print:h-auto print:overflow-visible ${mobileView === 'preview' ? 'flex' : 'hidden md:flex print:flex'}`}>

          {/* Zoom Controls Overlay */}
          <div className="absolute top-6 right-6 z-20 flex items-center space-x-1 bg-card/90 backdrop-blur-md border border-border rounded-full p-1 shadow-lg no-print">
            <button
              onClick={zoomOut}
              disabled={zoom <= 0.2}
              className="p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-panel disabled:opacity-30 disabled:pointer-events-none hover:scale-105 active:scale-90 transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-border mx-1" />
            <button
              onClick={() => setZoom(window.innerWidth < 768 ? 0.45 : 0.9)}
              className="group/zoom flex items-center px-4 py-1.5 rounded-full hover:bg-panel text-foreground/80 hover:text-foreground hover:scale-105 active:scale-95 transition cursor-pointer"
              title="Fit to Screen"
            >
              <span className="text-xs font-bold tracking-wider uppercase opacity-60 mr-2 hidden xl:inline">Fit</span>
              <span className="text-sm font-mono font-bold">
                {Math.round(zoom * 100)}%
              </span>
            </button>
            <div className="h-4 w-px bg-border mx-1" />
            <button
              onClick={zoomIn}
              disabled={zoom >= 1.5}
              className="p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-panel disabled:opacity-30 disabled:pointer-events-none hover:scale-105 active:scale-90 transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable sheet viewport wrapper */}
          <div className="flex-1 w-full overflow-auto p-12 pt-24 flex justify-center items-start bg-background print:overflow-visible print:pt-0 print:p-0 print:block">
            <div 
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
              className="origin-top select-text transition-transform duration-100 ease-out print:transform-none print:origin-top-left"
            >
              <ResumePreview data={data} />
            </div>
          </div>
        </main>
      </div>

      {/* 3. FLOATING SCREEN INDICATOR & TAB BAR (MOBILE ONLY) */}
      <div className="md:hidden fixed bottom-8 inset-x-0 z-40 no-print flex justify-center pointer-events-none">
        <div className="bg-card/80 backdrop-blur-md border border-border p-1.5 rounded-full flex shadow-2xl pointer-events-auto">
          <button 
            onClick={() => setMobileView('form')} 
            className={`px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 ${mobileView === 'form' ? 'bg-indigo-600 text-white shadow-md scale-105' : 'text-foreground/70 hover:text-foreground'}`}
          >
            <FileText className="w-4 h-4" /> Edit
          </button>
          <button 
            onClick={() => setMobileView('preview')} 
            className={`px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 ${mobileView === 'preview' ? 'bg-indigo-600 text-white shadow-md scale-105' : 'text-foreground/70 hover:text-foreground'}`}
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
        </div>
      </div>

      <div className="md:hidden fixed bottom-24 right-6 z-30 no-print flex flex-col space-y-3">
        {firebaseActive && user && (
          <div className="p-2.5 rounded-full bg-card border border-border shadow-xl flex items-center justify-center text-foreground/80">
            {syncStatus === 'synced' && <Check className="w-4.5 h-4.5 text-emerald-400" />}
            {syncStatus === 'saving' && <RefreshCw className="w-4.5 h-4.5 animate-spin text-indigo-400" />}
            {syncStatus === 'error' && <AlertTriangle className="w-4.5 h-4.5 text-rose-400" />}
          </div>
        )}
        <button
          onClick={handlePrint}
          className="p-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center scale-110 active:scale-100 transition"
          title="Print CV PDF"
        >
          <Printer className="w-5 h-5" />
        </button>
      </div>

      {/* 4. AI DRAWER OVERLAY */}
      <AiAssistantDrawer
        isOpen={aiDrawerOpen}
        onClose={() => {
          setAiDrawerOpen(false);
          setAiPath(null);
        }}
        originalText={aiInputText}
        type={aiType}
        jobTitle={data.personalInfo.title}
        onApply={handleApplyAiEnhancement}
      />

      {/* 5. CLOUD CONFLICT RESOLUTION MODAL OVERLAY */}
      {conflictResume && (
        <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-6 no-print animate-fade-in">
          <div className="glass-panel max-w-2xl w-full rounded-2xl border border-border overflow-hidden shadow-2xl flex flex-col bg-panel">
            <div className="p-6 border-b border-border bg-card flex items-center space-x-3 text-indigo-500">
              <CloudLightning className="w-5 h-5 shrink-0" />
              <div>
                <h3 className="text-md font-bold text-[var(--foreground)]">Resume Synced Conflict</h3>
                <p className="text-xs text-foreground/60 mt-0.5">
                  We found different versions of your resume in the cloud and your browser. Choose which one to keep:
                </p>
              </div>
            </div>

            {/* Split Options Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
              {/* Option A: Cloud version */}
              <div className="p-6 flex flex-col justify-between space-y-5 bg-indigo-500/5 hover:bg-indigo-500/10 transition">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Cloud className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Option A: Cloud Database Version</span>
                  </div>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    Loads the document previously stored on the Firebase Cloud database. This is recommended if you edited your resume on another device.
                  </p>
                  
                  {/* Miniature cloud profile status preview if name available */}
                  <div className="p-3 bg-card rounded-lg border border-border text-xs space-y-1">
                    <div className="text-[var(--foreground)] font-semibold truncate">
                      {conflictResume.personalInfo.name || 'Untitled Profile'}
                    </div>
                    <div className="text-foreground/60 font-mono text-xs truncate">
                      {conflictResume.personalInfo.title || 'No Job Title Specified'}
                    </div>
                    <div className="text-foreground/60 text-xs pt-1 flex justify-between">
                      <span>Experiences: {conflictResume.experiences?.length || 0}</span>
                      <span>Projects: {conflictResume.projects?.length || 0}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={resolveConflictWithCloud}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-500/10 cursor-pointer"
                >
                  Load Cloud Version
                </button>
              </div>

              {/* Option B: Local draft */}
              <div className="p-6 flex flex-col justify-between space-y-5 hover:bg-card/50 transition">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FileJson className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Option B: Browser Local Draft</span>
                  </div>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    Keep your current edits in this browser and overwrite the cloud database with this data. Choose this if you want to save what you are currently typing.
                  </p>

                  {/* Miniature local preview */}
                  <div className="p-3 bg-card rounded-lg border border-border text-xs space-y-1">
                    <div className="text-[var(--foreground)] font-semibold truncate">
                      {data.personalInfo.name || 'Untitled Profile'}
                    </div>
                    <div className="text-foreground/60 font-mono text-xs truncate">
                      {data.personalInfo.title || 'No Job Title Specified'}
                    </div>
                    <div className="text-foreground/60 text-xs pt-1 flex justify-between">
                      <span>Experiences: {data.experiences?.length || 0}</span>
                      <span>Projects: {data.projects?.length || 0}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={resolveConflictWithLocal}
                  className="w-full py-2.5 bg-card hover:bg-panel text-[var(--foreground)] border border-border rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Overwrite Cloud with Local
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5.5 PREMIUM PRESETS & TEMPLATES POPUP MODAL OVERLAY */}
      {isPresetsModalOpen && (
        <div className="fixed inset-0 bg-background/85 backdrop-blur-xs z-50 flex items-center justify-center p-4 sm:p-6 no-print animate-fade-in">
          <div className="bg-panel border border-border max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col transform hover:scale-[1.005] transition-transform duration-200 max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-5 bg-card border-b border-border flex items-center justify-between">
              <div className="flex items-center space-x-3 text-indigo-500">
                <span className="text-lg">📁</span>
                <div>
                  <h3 className="text-sm font-bold text-[var(--foreground)]">Resume Presets & Templates</h3>
                  <p className="text-[11px] text-foreground/50">Load pre-built industry templates or manage your saved custom drafts.</p>
                </div>
              </div>
              <button
                onClick={() => setIsPresetsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-panel text-foreground/50 hover:text-foreground transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
              
              {/* Save Current Workspace Action Bar */}
              <div className="p-4 rounded-xl border border-dashed border-indigo-500/30 bg-indigo-500/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Save Current Draft</h4>
                  <p className="text-[10px] text-foreground/60 leading-normal">
                    Capture the current workspace data as a new custom preset to load or backup later.
                  </p>
                </div>
                <button
                  onClick={saveCurrentAsPreset}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  New Current Workspace
                </button>
              </div>

              {/* AI PDF Layout Capture Action Bar */}
              <div className="p-4 rounded-xl border border-dashed border-indigo-500/30 bg-indigo-500/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 animate-pulse" />
                    <span>AI PDF Layout Capture</span>
                  </h4>
                  <p className="text-[10px] text-foreground/60 leading-normal">
                    Upload your existing resume.pdf to extract its contents and layout into editable fields.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsPresetsModalOpen(false);
                    setIsPdfImportOpen(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-750 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  Import PDF Resume
                </button>
              </div>

              {/* SECTION A: DEMO TEMPLATES */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Demo Templates</h4>
                
                {/* Responsive Layout: Grid on Desktop, Horizontal Scroll Row on Mobile */}
                <div className="md:grid md:grid-cols-3 md:gap-4 flex overflow-x-auto snap-x scrollbar-thin space-x-4 md:space-x-0 pb-3 md:pb-0">
                  {[
                    { key: 'software', title: 'Software Engineer', tag: 'Demo', desc: 'Pre-filled with professional software developer templates (Alex Rivera).', border: 'hover:border-indigo-500/40', btn: 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white' },
                    { key: 'pm', title: 'Product Manager', tag: 'Metrics Focus', desc: 'Pre-filled with lead product manager templates (Sarah Chen) with metrics focus.', border: 'hover:border-teal-500/40', btn: 'bg-teal-500/10 text-teal-400 hover:bg-teal-500 hover:text-white' },
                    { key: 'designer', title: 'Creative Designer', tag: '2 Column', desc: 'Pre-filled with senior UX/UI designer templates (Mia Vance) utilizing a split layout.', border: 'hover:border-purple-500/40', btn: 'bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white' }
                  ].map((preset) => (
                    <div 
                      key={preset.key}
                      className={`snap-center shrink-0 w-64 md:w-auto p-4 rounded-xl border border-border bg-card flex flex-col justify-between space-y-4 ${preset.border} transition`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[var(--foreground)] truncate max-w-[130px] block" title={preset.title}>{preset.title}</span>
                          <span className="text-[9px] font-bold bg-slate-500/10 text-foreground/60 px-1.5 py-0.5 rounded shrink-0">{preset.tag}</span>
                        </div>
                        <p className="text-[10px] text-foreground/65 leading-relaxed">
                          {preset.desc}
                        </p>
                      </div>
                      <button
                        onClick={() => handlePresetClick(preset.key)}
                        className={`w-full py-2 rounded-lg text-xs font-bold transition cursor-pointer ${preset.btn}`}
                      >
                        Load Template
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION B: USER CUSTOM PRESETS */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-wider">My Saved Presets</h4>
                
                {savedPresets.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-border rounded-xl bg-card">
                    <p className="text-xs text-foreground/40 font-mono">No custom saved presets found.</p>
                    <p className="text-[10px] text-foreground/30 mt-1">Use the "New Current Workspace" tool above to save drafts.</p>
                  </div>
                ) : (
                  /* Responsive layout: Grid on Desktop, Horizontal Scroll Row on Mobile */
                  <div className="md:grid md:grid-cols-3 md:gap-4 flex overflow-x-auto snap-x scrollbar-thin space-x-4 md:space-x-0 pb-3 md:pb-0">
                    {savedPresets.map((preset) => (
                      <div
                        key={preset.id}
                        className="snap-center shrink-0 w-64 md:w-auto p-4 rounded-xl border border-border bg-card flex flex-col justify-between space-y-4 hover:border-indigo-500/20 transition relative group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-bold text-[var(--foreground)] truncate max-w-[140px] block" title={preset.label}>
                              {preset.label}
                            </span>
                            <span className="text-[9px] text-foreground/40 font-mono shrink-0">
                              {preset.updatedAt.split(',')[0]}
                            </span>
                          </div>
                          
                          {/* Miniature data metadata preview */}
                          <div className="text-[10px] text-foreground/60 leading-normal space-y-0.5 font-sans border-t border-border/40 pt-2">
                            <div className="truncate font-semibold text-foreground/80">
                              👤 {preset.data.personalInfo.name || 'Anonymous'}
                            </div>
                            <div className="truncate text-foreground/50">
                              💼 {preset.data.personalInfo.title || 'Untitled Role'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-1">
                          <button
                            onClick={() => handleLoadCustomPreset(preset)}
                            className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => deleteCustomPreset(preset.id, preset.label)}
                            className="p-1.5 border border-border hover:border-rose-500/30 hover:bg-rose-500/5 text-foreground/45 hover:text-rose-500 rounded-lg text-xs transition cursor-pointer flex items-center justify-center"
                            title="Delete Preset"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-card border-t border-border flex items-center justify-between space-x-2">
              {user ? (
                <div className="flex items-center bg-panel border border-border rounded-xl overflow-hidden w-full max-w-[200px] sm:max-w-xs focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
                  <Key className="w-3.5 h-3.5 text-foreground/40 ml-3 shrink-0" />
                  <input
                      type={showGeminiKey ? 'text' : 'password'}
                      placeholder="Paste Gemini API Key..."
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      className="w-full bg-transparent pl-2 pr-2 py-1.5 text-xs text-[var(--foreground)] placeholder:text-foreground/40 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGeminiKey(!showGeminiKey)}
                      className="pr-3 pl-1 text-foreground/40 hover:text-foreground/70 transition-colors focus:outline-none cursor-pointer"
                      title={showGeminiKey ? "Hide Key" : "Show Key"}
                    >
                      {showGeminiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  <button
                    onClick={handleSaveGeminiKey}
                    className="px-3 bg-card hover:bg-panel border-l border-border text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer shrink-0"
                  >
                    Save Key
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-semibold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                  <span>Cloud Save & AI Disabled in Guest Mode</span>
                </div>
              )}
              <div className="flex space-x-2 shrink-0">
                <button
                  onClick={handleRenamePreset}
                  className="px-3.5 py-1.5 border border-border hover:bg-panel rounded-xl text-xs font-semibold text-foreground/60 hover:text-foreground active:scale-95 transition-all cursor-pointer hidden sm:block"
                >
                  Rename Active
                </button>
                <button
                  onClick={() => setIsPresetsModalOpen(false)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. PREMIUM CONFIRM / ALERT MODAL OVERLAY */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-background/85 backdrop-blur-xs z-50 flex items-center justify-center p-6 no-print animate-fade-in">
          <div className="bg-panel border border-border max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col transform hover:scale-[1.01] transition-transform duration-200">
            <div className="p-5 bg-card border-b border-border flex items-center space-x-3 text-indigo-500">
              <Info className="w-4.5 h-4.5 shrink-0" />
              <h3 className="text-sm font-bold text-[var(--foreground)]">{confirmModal.title}</h3>
            </div>
            
            <div className="p-5">
              <p className="text-xs text-foreground/70 leading-normal">
                {confirmModal.message}
              </p>
            </div>

            {confirmModal.hasInput && (
              <div className="px-5 pb-5">
                <input
                  type="text"
                  value={modalInputValue}
                  onChange={(e) => setModalInputValue(e.target.value)}
                  placeholder={confirmModal.inputPlaceholder || 'Enter name...'}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-background border border-border text-[var(--foreground)] focus:outline-none focus:border-indigo-500 transition-colors"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (confirmModal.onConfirm) confirmModal.onConfirm(modalInputValue);
                    }
                  }}
                />
              </div>
            )}

            <div className="p-4 bg-card border-t border-border flex items-center justify-end space-x-2">
              {!confirmModal.isAlertOnly && (
                <button
                  onClick={confirmModal.onCancel || closeConfirmModal}
                  className="px-3.5 py-1.5 border border-border hover:bg-panel rounded-xl text-xs font-semibold text-foreground/60 hover:text-foreground active:scale-95 transition-all cursor-pointer"
                >
                  {confirmModal.cancelText || 'Cancel'}
                </button>
              )}
              <button
                onClick={() => {
                  if (confirmModal.onConfirm) confirmModal.onConfirm(modalInputValue);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold text-white hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm ${
                  confirmModal.title.toLowerCase().includes('clear') || 
                  confirmModal.title.toLowerCase().includes('sign out') || 
                  confirmModal.title.toLowerCase().includes('overwrite') ||
                  confirmModal.title.toLowerCase().includes('delete')
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/10 hover:shadow-rose-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/10 hover:shadow-indigo-500/20'
                }`}
              >
                {confirmModal.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. AI PDF IMPORT MODAL OVERLAY */}
      <PdfImportModal 
        isOpen={isPdfImportOpen} 
        onClose={() => setIsPdfImportOpen(false)} 
        onSuccess={(parsedData) => {
          const presetLabel = parsedData.personalInfo?.name 
            ? `${parsedData.personalInfo.name}'s Resume` 
            : 'Imported PDF Resume';

          const newPreset = {
            id: `preset-${Date.now()}`,
            label: presetLabel,
            data: parsedData,
            updatedAt: new Date().toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          };

          const updated = [...savedPresets, newPreset];
          setSavedPresets(updated);
          if (user && firebaseActive) {
            savePresetsToCloud(user.uid, updated).catch(console.error);
          } else {
            showAlert('Login Required', 'Please log in with Google to save presets to your cloud account.');
          }

          handleDataChange(parsedData);
          updatePresetLabel(presetLabel);
          showAlert('PDF Imported Successfully', `Your resume has been parsed as "${presetLabel}" and automatically saved to your presets.`);
        }} 
      />
    </div>
  );
}
