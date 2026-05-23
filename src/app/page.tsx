'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, FileText, Upload, Plus, Cpu, Layout, 
  Printer, ArrowRight, Code, Briefcase, LogIn, LogOut, 
  User, Database, Eye, EyeOff, CheckCircle2, ShieldCheck, Mail, Lock, Info,
  Sun, Moon, Trash2, Calendar, Globe
} from 'lucide-react';
import { ResumeData } from '../types/resume';
import { DEMO_PRESETS, BLANK_RESUME } from '../utils/demoData';
import PdfImportModal from '../components/PdfImportModal';
import { 
  auth, 
  loginWithGoogle, 
  logoutUser, 
  isFirebaseConfigured, 
  getResumeFromCloud,
  registerWithEmail,
  loginWithEmail
} from '../utils/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function Home() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState('');

  // Custom Saved Presets State
  const [savedPresets, setSavedPresets] = useState<Array<{ id: string; label: string; data: ResumeData; updatedAt: string }>>([]);
  const [isPdfImportOpen, setIsPdfImportOpen] = useState(false);

  // Load custom presets on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('resume_builder_presets');
      if (stored) {
        try {
          setSavedPresets(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse saved presets:', e);
        }
      }
    }
  }, []);

  // Custom confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    isAlertOnly?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

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
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleLoadCustomPreset = (preset: { id: string; label: string; data: ResumeData }) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('resume_builder_data', JSON.stringify(preset.data));
      localStorage.setItem('loaded_preset_label', preset.label);
    }
    router.push('/builder');
  };

  const deleteCustomPreset = (id: string, label: string) => {
    showConfirm(
      'Delete Custom Preset',
      `Are you sure you want to permanently delete the custom preset "${label}"?`,
      () => {
        const updated = savedPresets.filter(p => p.id !== id);
        setSavedPresets(updated);
        if (typeof window !== 'undefined') {
          localStorage.setItem('resume_builder_presets', JSON.stringify(updated));
        }
      },
      'Delete'
    );
  };
  
  // Auth state
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [firebaseActive, setFirebaseActive] = useState(false);
  const [hasCloudResume, setHasCloudResume] = useState(false);
  const [checkingCloud, setCheckingCloud] = useState(false);

  // Popover state
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileLoginModal, setShowMobileLoginModal] = useState(false);

  // Theme & Profile Fallback states
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [photoFailed, setPhotoFailed] = useState(false);

  // Form states
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

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


  useEffect(() => {
    const active = isFirebaseConfigured();
    setFirebaseActive(active);

    if (active && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setUser(firebaseUser);
        if (firebaseUser) {
          setCheckingCloud(true);
          try {
            const cloudData = await getResumeFromCloud(firebaseUser.uid);
            setHasCloudResume(!!cloudData);
          } catch (err) {
            console.error('Error fetching cloud resume on mount:', err);
          } finally {
            setCheckingCloud(false);
          }
        } else {
          setHasCloudResume(false);
        }
        setLoadingAuth(false);
      });
      return () => unsubscribe();
    } else {
      setLoadingAuth(false);
    }
  }, []);

  // Google authentication
  const handleGoogleLogin = async () => {
    setFormError('');
    setFormLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setFormError('Google sign-in failed. Please verify environment settings.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Email registration
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!fullName || !email || !password) {
      setFormError('Please fill in all input fields.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    setFormLoading(true);
    try {
      await registerWithEmail(email, password, fullName);
      setFormSuccess('Account created successfully!');
    } catch (err: any) {
      let friendlyMessage = 'Failed to create account.';
      if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'This email is already registered.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'Please enter a valid email address.';
      } else if (err.message) {
        friendlyMessage = err.message;
      }
      setFormError(friendlyMessage);
    } finally {
      setFormLoading(false);
    }
  };

  // Email login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!email || !password) {
      setFormError('Please enter email and password.');
      return;
    }

    setFormLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      let friendlyMessage = 'Failed to sign in.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyMessage = 'Invalid email or password.';
      } else if (err.message) {
        friendlyMessage = err.message;
      }
      setFormError(friendlyMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      // Clear form inputs
      setEmail('');
      setPassword('');
      setFullName('');
      setFormError('');
      setFormSuccess('');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const selectPreset = (key: string) => {
    const selected = DEMO_PRESETS[key];
    if (selected) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('resume_builder_data', JSON.stringify(selected.data));
        localStorage.setItem('loaded_preset_label', selected.label);
      }
      router.push('/builder');
    }
  };

  const createBlankCanvas = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('resume_builder_data', JSON.stringify(BLANK_RESUME));
      localStorage.setItem('loaded_preset_label', 'Blank Resume');

      // Auto-save blank canvas as a custom preset
      const newPreset = {
        id: `preset-${Date.now()}`,
        label: 'Blank Resume',
        data: BLANK_RESUME,
        updatedAt: new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      const stored = localStorage.getItem('resume_builder_presets');
      let current = [];
      if (stored) {
        try {
          current = JSON.parse(stored);
        } catch (e) {}
      }
      const updated = [...current, newPreset];
      localStorage.setItem('resume_builder_presets', JSON.stringify(updated));
    }
    router.push('/builder');
  };

  const loadCloudResume = async () => {
    if (!user) return;
    setCheckingCloud(true);
    try {
      const cloudData = await getResumeFromCloud(user.uid);
      if (cloudData) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('resume_builder_data', JSON.stringify(cloudData));
          localStorage.setItem('loaded_preset_label', cloudData.personalInfo?.name ? `${cloudData.personalInfo.name}'s Resume` : 'Cloud Resume');
        }
        router.push('/builder');
      } else {
        // No cloud resume, load default blank/software draft
        selectPreset('software');
      }
    } catch (err) {
      setImportError('Failed to retrieve your cloud resume.');
    } finally {
      setCheckingCloud(false);
    }
  };

  const handleEnterWorkspace = () => {
    if (firebaseActive && user) {
      loadCloudResume();
    } else {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('resume_builder_data');
        if (!saved) {
          localStorage.setItem('resume_builder_data', JSON.stringify(DEMO_PRESETS.software.data));
          localStorage.setItem('loaded_preset_label', DEMO_PRESETS.software.label);
        }
      }
      router.push('/builder');
    }
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsImporting(true);
    setImportError('');
    const file = files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        
        // Quick validate schema
        if (!parsed.personalInfo || !parsed.settings) {
          throw new Error('Invalid resume schema. Missing personalInfo or settings block.');
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('resume_builder_data', JSON.stringify(parsed));
        }
        
        router.push('/builder');
      } catch (err) {
        setImportError(err instanceof Error ? err.message : 'Invalid JSON file structure.');
        setIsImporting(false);
      }
    };
    reader.onerror = () => {
      setImportError('Failed to read file.');
      setIsImporting(false);
    };
    reader.readAsText(file);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

    const renderWorkspacePanel = () => (
    <div className="space-y-6 animate-fade-in">
                  <div className="text-center space-y-3">
                    {/* User profile picture / fallback */}
                    <div className="relative inline-block mx-auto">
                      {user && !photoFailed && user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt="Profile Picture" 
                          className="w-16 h-16 rounded-2xl border border-[var(--border-color)] shadow-xl"
                          onError={() => setPhotoFailed(true)}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-2xl text-indigo-400 shadow-xl">
                          {user ? (user.displayName || user.email || 'U')[0].toUpperCase() : 'SB'}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-[var(--foreground)]">
                        {user ? `Welcome, ${user.displayName || 'Developer'}!` : 'Sandbox Workspace'}
                      </h3>
                      {!user && (
                        <p className="text-[11px] text-amber-500 font-semibold bg-amber-500/10 border border-amber-500/20 rounded-full px-3.5 py-0.5 inline-block">
                          Offline Sandbox Mode
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleEnterWorkspace}
                      disabled={checkingCloud}
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
                    >
                      {checkingCloud ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Database className="w-4.5 h-4.5" />
                          <span>
                            {firebaseActive 
                              ? (hasCloudResume ? 'Open Cloud Resume' : 'Start Workspace') 
                              : 'Open Sandbox Editor'}
                          </span>
                        </>
                      )}
                    </button>

                    <div className="relative my-6 flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[var(--border-color)]"></div>
                      </div>
                      <span className="relative px-3 bg-[var(--background)] text-xs text-foreground/50 uppercase tracking-widest font-bold">
                        Or load template preset
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { key: 'software', label: 'Developer', sub: 'Tech Focus', icon: <Code className="w-4 h-4 text-indigo-450 mb-1" /> },
                        { key: 'pm', label: 'Product Lead', sub: 'Metrics Focus', icon: <Briefcase className="w-4 h-4 text-teal-450 mb-1" /> },
                        { key: 'designer', label: 'Designer', sub: 'Creative 2 Col', icon: <Layout className="w-4 h-4 text-purple-400 mb-1" /> }
                      ].map((preset) => (
                        <button
                          key={preset.key}
                          onClick={() => selectPreset(preset.key)}
                          className="flex flex-col items-center p-2.5 bg-[var(--card-background)] hover:bg-[var(--panel-background)] border border-[var(--border-color)] rounded-xl text-center hover:scale-[1.03] active:scale-[0.97] transition duration-200 cursor-pointer animate-fade-in"
                          title={`Load ${preset.label} template`}
                        >
                          {preset.icon}
                          <div className="truncate w-full">
                            <div className="text-[10px] font-bold text-[var(--foreground)] truncate">{preset.label}</div>
                            <div className="text-[9px] text-foreground/50 truncate">{preset.sub}</div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button
                        type="button"
                        onClick={createBlankCanvas}
                        className="flex items-center justify-center space-x-1.5 py-2.5 bg-[var(--card-background)] hover:bg-[var(--panel-background)] border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--foreground)] hover:scale-[1.03] active:scale-[0.97] transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-foreground/50 shrink-0" />
                        <span>Blank Canvas</span>
                      </button>

                      <button
                        onClick={triggerUpload}
                        disabled={isImporting}
                        className="flex items-center justify-center space-x-1.5 py-2.5 bg-[var(--card-background)] hover:bg-[var(--panel-background)] border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--foreground)] hover:scale-[1.03] active:scale-[0.97] transition cursor-pointer"
                      >
                        <Upload className="w-4 h-4 text-foreground/50 shrink-0" />
                        <span>Import Backup</span>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleJsonUpload}
                          accept=".json"
                          className="hidden"
                        />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPdfImportOpen(true)}
                      className="w-full flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/15 hover:to-purple-500/15 border border-indigo-500/30 rounded-xl text-xs font-bold text-[var(--foreground)] hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer shadow-sm mt-1"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
                      <span>AI Import from PDF Resume</span>
                    </button>
                  </div>
                </div>
  );

  const renderAuthPanel = () => (
    <div className="space-y-5">
                  
                  {/* Tab Selector Headers */}
                  <div className="flex border-b border-[var(--border-color)]">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('signin');
                        setFormError('');
                        setFormSuccess('');
                      }}
                      className={`flex-1 pb-3 text-center text-sm font-bold border-b-2 transition ${
                        authTab === 'signin' 
                          ? 'border-indigo-500 text-[var(--foreground)]' 
                          : 'border-transparent text-foreground/50 hover:text-[var(--foreground)]'
                      } cursor-pointer`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('signup');
                        setFormError('');
                        setFormSuccess('');
                      }}
                      className={`flex-1 pb-3 text-center text-sm font-bold border-b-2 transition ${
                        authTab === 'signup' 
                          ? 'border-indigo-500 text-[var(--foreground)]' 
                          : 'border-transparent text-foreground/50 hover:text-[var(--foreground)]'
                      } cursor-pointer`}
                    >
                      Register
                    </button>
                  </div>

                  {/* Auth forms */}
                  <form onSubmit={authTab === 'signin' ? handleEmailLogin : handleEmailRegister} className="space-y-4 pt-1">
                    
                    {/* Full Name field (Only on Registration) */}
                    {authTab === 'signup' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground/60 uppercase tracking-wide">Full Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={formLoading}
                            className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder-foreground/40 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                          />
                        </div>
                      </div>
                    )}

                    {/* Email Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground/60 uppercase tracking-wide">Email Address</label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          placeholder="name@domain.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={formLoading}
                          className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder-foreground/40 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-foreground/60 uppercase tracking-wide">Password</label>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={formLoading}
                          className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-[var(--foreground)] placeholder-foreground/40 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/45 hover:text-foreground/75 transition"
                        >
                          {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Alerts display */}
                    {formError && (
                      <div className="px-3.5 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-500 font-medium">
                        {formError}
                      </div>
                    )}
                    
                    {formSuccess && (
                      <div className="px-3.5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{formSuccess}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-700/60 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition duration-200 cursor-pointer"
                    >
                      {formLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <LogIn className="w-4 h-4" />
                          <span>{authTab === 'signin' ? 'Sign In to Account' : 'Create Free Account'}</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Google OAuth Login Option */}
                  {firebaseActive && (
                    <div className="space-y-4">
                      <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-[var(--border-color)]"></div>
                        </div>
                        <span className="relative px-3.5 bg-[var(--background)] text-xs text-foreground/50 uppercase tracking-widest font-bold">
                          Or connect securely
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={formLoading}
                        className="w-full flex items-center justify-center space-x-2.5 px-4 py-2.5 bg-[var(--card-background)] hover:bg-[var(--panel-background)] border border-[var(--border-color)] hover:border-indigo-500/30 text-sm font-bold text-[var(--foreground)] rounded-xl transition duration-200 shadow-md cursor-pointer"
                      >
                        <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.48 3.77v3.13h3.99c2.34-2.16 3.68-5.32 3.68-8.75z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.99-3.13c-1.11.75-2.53 1.19-3.97 1.19-3.05 0-5.64-2.06-6.56-4.83H1.47v3.23C3.45 21.84 7.49 24 12 24z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.44 14.32a7.18 7.18 0 0 1 0-4.64V6.45H1.47a11.96 11.96 0 0 0 0 11.1l3.97-3.23z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 7.49 0 3.45 2.16 1.47 5.75l3.97 3.23c.92-2.77 3.51-4.83 6.56-4.83z"
                          />
                        </svg>
                        <span>Continue with Google</span>
                      </button>
                    </div>
                  )}

                  {/* Continue as Guest Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleEnterWorkspace}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-card hover:bg-panel border border-border hover:border-foreground/30 text-xs font-bold text-foreground/60 hover:text-foreground rounded-xl transition duration-200 cursor-pointer"
                    >
                      <span>Continue as Guest (No Cloud Save / AI)</span>
                    </button>
                  </div>

                  {/* Sandbox helper instructions if Firebase keys are absent */}
                  {!firebaseActive && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start space-x-2 text-xs text-amber-600 dark:text-amber-500 leading-normal">
                      <Info className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>
                        <b>Sandbox Notice:</b> Firebase configuration is missing in your <code className="bg-[var(--card-background)] px-1.5 py-0.5 rounded border border-[var(--border-color)] text-xs">.env.local</code>. Database saving and user sign-in forms are simulated or offline.
                      </p>
                    </div>
                  )}

                </div>
  );

  return (
    <div className="flex-1 w-full min-h-screen relative flex flex-col justify-between overflow-x-hidden select-none bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-900/5 dark:bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none -z-10 animate-fade-in" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-purple-900/5 dark:bg-purple-900/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-fade-in" />
      
      {/* Decorative Grid Line */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* Floating Top Navigation Header */}
      <nav className="w-full h-16 border-b border-[var(--border-color)] bg-[var(--panel-background)] px-6 flex items-center justify-between z-20 sticky top-0 transition-colors duration-200">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg shadow-md shadow-indigo-500/10">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            ResumeAI
          </span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border transition ${
            firebaseActive 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
              : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-500'
          }`}>
            {firebaseActive ? 'Cloud Sync Connected' : 'Local Sandbox Mode'}
          </span>
        </div>

        {/* Theme Switcher and Auth profile status */}
        <div className="flex items-center space-x-3 relative">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--card-background)] hover:bg-[var(--panel-background)] text-[var(--foreground)] opacity-80 hover:opacity-100 transition cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {loadingAuth ? (
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          ) : user ? (
            <div 
               onClick={() => window.innerWidth < 1024 && setShowMobileLoginModal(true)} 
               className="flex items-center space-x-3 p-1 rounded-xl border border-[var(--border-color)] bg-[var(--card-background)] lg:cursor-default cursor-pointer"
            >
              <div className="hidden sm:flex flex-col text-right px-1.5">
                <span className="text-xs font-bold text-[var(--foreground)]">{user.displayName || 'Authenticated User'}</span>
              </div>
              {!photoFailed && user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-xl border border-[var(--border-color)] shrink-0 animate-fade-in"
                  onError={() => setPhotoFailed(true)}
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-400 shrink-0">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
            </div>
          ) : (
            firebaseActive && (
              <button
                onClick={() => setShowMobileLoginModal(true)}
                className="lg:hidden flex items-center justify-center p-2 rounded-xl border border-[var(--border-color)] bg-[var(--card-background)] text-indigo-500 hover:bg-[var(--panel-background)] transition cursor-pointer"
              >
                <User className="w-4.5 h-4.5" />
              </button>
            )
          )}
        </div>
      </nav>

      {/* Two-Column Grid Workspace Layout */}
      <div className="w-full max-w-6xl mx-auto px-6 py-8 sm:py-16 flex-grow flex flex-col justify-center gap-16">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Product Branding & Features */}
          <div className="lg:col-span-7 space-y-8 animate-fade-in pr-0 lg:pr-6 order-2 lg:order-1">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>AI Resume Workspace</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none bg-gradient-to-b from-[var(--foreground)] via-[var(--foreground)] to-[var(--foreground)]/60 dark:to-slate-400 bg-clip-text text-transparent">
                Build Stunning Resumes.
              </h1>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-indigo-500 dark:text-indigo-400 leading-tight">
                Powered by Interactive AI.
              </h2>
              <p className="text-foreground/60 text-sm sm:text-base leading-relaxed max-w-lg">
                Design a metrics-focused, print-perfect CV in minutes. Auto-save your progress securely in the cloud, collaborate with AI, and download standard A4 PDFs instantly.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="glass-panel p-5 rounded-xl flex items-start space-x-4 transition">
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-500 dark:text-indigo-400 shrink-0">
                  <Cpu className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[var(--foreground)]">AI Bullet Enhancer</h4>
                  <p className="text-xs text-foreground/60 leading-normal">
                    Polishes bullet points to emphasize strategic achievements and metrics.
                  </p>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl flex items-start space-x-4 transition">
                <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-lg text-teal-500 dark:text-teal-400 shrink-0">
                  <Layout className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[var(--foreground)]">Live A4 Compiler</h4>
                  <p className="text-xs text-foreground/60 leading-normal">
                    Previews exact font heights, colors, sidebar margins on paper bounds in real-time.
                  </p>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl flex items-start space-x-4 transition">
                <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-550 dark:text-purple-400 shrink-0">
                  <Database className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[var(--foreground)]">Auto-Cloud Saving</h4>
                  <p className="text-xs text-foreground/60 leading-normal">
                    Saves edits dynamically to Firebase. Never lose configurations or content.
                  </p>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl flex items-start space-x-4 transition">
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Printer className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[var(--foreground)]">One-Click PDF Export</h4>
                  <p className="text-xs text-foreground/60 leading-normal">
                    Bypasses browser margins automatically using isolated print media queries.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Form Box / Welcome Panel */}
          <div className="hidden lg:block lg:col-span-5 w-full max-w-md mx-auto relative z-10 order-1 lg:order-2">
            <div className="glass-panel p-6 rounded-2xl relative z-10 shadow-2xl transition duration-300">
              
              {loadingAuth ? (
                /* Main loading state */
                <div className="py-16 flex flex-col items-center justify-center space-y-4">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-foreground/50">Checking credentials...</span>
                </div>
              ) : (user || !firebaseActive) ? (
                /* Authenticated User Console Panel / Sandbox Panel */
                renderWorkspacePanel()
              ) : (
                /* Desktop Auth Panel */
                renderAuthPanel()
              )}

            </div>

            {/* Relocated logout button below the console card */}
            {user && (
              <div className="relative z-30 mt-5 w-full">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full relative flex items-center justify-center space-x-2 py-3.5 bg-rose-600 hover:bg-rose-500 text-white border-t border-x border-rose-500/20 border-b-[6px] border-rose-800 hover:border-rose-700 active:border-b-[2px] active:translate-y-[4px] rounded-xl text-sm font-extrabold transition-all duration-75 cursor-pointer animate-fade-in"
                >
                  <LogOut className="w-4.5 h-4.5 text-white" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Custom Presets Grid/Carousel */}
        {savedPresets.length > 0 && (
          <div className="w-full space-y-6 pt-10 border-t border-[var(--border-color)]/60 animate-fade-in">
            <div className="flex items-center space-x-3 text-indigo-500">
              <span className="text-xl">📁</span>
              <div>
                <h3 className="text-lg font-bold text-[var(--foreground)]">Your Saved Resumes</h3>
                <p className="text-xs text-foreground/50">Continue editing your custom drafts or manage your saved checkpoints.</p>
              </div>
            </div>

            {/* Grid / Horizontal Row layout */}
            <div className="md:grid md:grid-cols-3 md:gap-6 flex overflow-x-auto snap-x scrollbar-thin space-x-4 md:space-x-0 pb-4 md:pb-0">
              {savedPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="snap-center shrink-0 w-72 md:w-auto p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--card-background)] hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between space-y-5 shadow-sm hover:shadow-md hover:scale-[1.01] relative group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-extrabold text-[var(--foreground)] truncate max-w-[170px] block" title={preset.label}>
                        {preset.label}
                      </span>
                      <span className="flex items-center text-[10px] text-foreground/40 font-mono shrink-0 bg-[var(--panel-background)] px-2 py-0.5 rounded-md border border-[var(--border-color)]">
                        <Calendar className="w-3 h-3 mr-1 opacity-60" />
                        {preset.updatedAt.split(',')[0]}
                      </span>
                    </div>
                    
                    {/* Miniature data metadata preview */}
                    <div className="text-xs text-foreground/60 leading-normal space-y-1 font-sans border-t border-[var(--border-color)]/40 pt-3">
                      <div className="truncate font-semibold text-foreground/80 flex items-center">
                        <span className="mr-1.5 opacity-70">👤</span>
                        {preset.data.personalInfo.name || 'Anonymous'}
                      </div>
                      <div className="truncate text-foreground/50 flex items-center">
                        <span className="mr-1.5 opacity-70">💼</span>
                        {preset.data.personalInfo.title || 'Untitled Role'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleLoadCustomPreset(preset)}
                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/10 cursor-pointer flex items-center justify-center space-x-1.5 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>Edit Resume</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCustomPreset(preset.id, preset.label)}
                      className="p-2 border border-[var(--border-color)] hover:border-rose-500/30 hover:bg-rose-500/5 text-foreground/45 hover:text-rose-500 rounded-xl text-xs transition duration-200 cursor-pointer flex items-center justify-center"
                      title="Delete Preset"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {importError && (
        <div className="my-6 mx-auto px-4 py-2 bg-rose-950/20 border border-rose-900/30 rounded-xl text-xs text-rose-400 max-w-sm text-center">
          {importError}
        </div>
      )}

      {/* Footer copyright */}
      <footer className="w-full text-center py-6 border-t border-border bg-panel text-foreground/50 text-xs font-mono">
        &copy; {new Date().getFullYear()} ResumeAI Builder &bull; Built with Next.js &amp; Tailwind CSS
      </footer>

      {/* 6. PREMIUM CONFIRM / ALERT MODAL OVERLAY */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-background/85 backdrop-blur-xs z-50 flex items-center justify-center p-6 no-print animate-fade-in">
          <div className="bg-[var(--panel-background)] border border-[var(--border-color)] max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col transform hover:scale-[1.01] transition-transform duration-200">
            <div className="p-5 bg-[var(--card-background)] border-b border-[var(--border-color)] flex items-center space-x-3 text-indigo-500">
              <Info className="w-4.5 h-4.5 shrink-0" />
              <h3 className="text-sm font-bold text-[var(--foreground)]">{confirmModal.title}</h3>
            </div>
            
            <div className="p-5">
              <p className="text-xs text-foreground/70 leading-normal">
                {confirmModal.message}
              </p>
            </div>

            <div className="p-4 bg-[var(--card-background)] border-t border-[var(--border-color)] flex items-center justify-end space-x-2">
              {!confirmModal.isAlertOnly && (
                <button
                  type="button"
                  onClick={confirmModal.onCancel || closeConfirmModal}
                  className="px-3.5 py-1.5 border border-[var(--border-color)] hover:bg-[var(--panel-background)] rounded-xl text-xs font-semibold text-foreground/60 hover:text-foreground active:scale-95 transition-all cursor-pointer"
                >
                  {confirmModal.cancelText || 'Cancel'}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (confirmModal.onConfirm) confirmModal.onConfirm();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold text-white hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm ${
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

      {/* Mobile Login Modal */}
      {showMobileLoginModal && (
        <div className="lg:hidden fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[var(--background)]/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl shadow-2xl relative animate-fade-in max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowMobileLoginModal(false)} className="absolute top-4 right-4 p-2 text-foreground/50 hover:text-foreground">
              <span className="text-sm font-bold bg-card border border-border px-2 py-1 rounded-full">✕</span>
            </button>
            <div className="mt-6">
              {!user && firebaseActive && <h2 className="text-xl font-bold mb-4 text-[var(--foreground)] text-center tracking-tight">Sign In / Register</h2>}
              {user || !firebaseActive ? (
                <div className="space-y-6">
                  {renderWorkspacePanel()}
                  {user && (
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        setShowMobileLoginModal(false);
                      }}
                      className="w-full relative flex items-center justify-center space-x-2 py-3.5 bg-rose-600 hover:bg-rose-500 text-white border-t border-x border-rose-500/20 border-b-[6px] border-rose-800 hover:border-rose-700 active:border-b-[2px] active:translate-y-[4px] rounded-xl text-sm font-extrabold transition-all duration-75 cursor-pointer animate-fade-in"
                    >
                      <LogOut className="w-4.5 h-4.5 text-white" />
                      <span>Log Out</span>
                    </button>
                  )}
                </div>
              ) : renderAuthPanel()}
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

          if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('resume_builder_presets');
            let current = [];
            if (stored) {
              try {
                current = JSON.parse(stored);
              } catch (e) {}
            }
            const updated = [...current, newPreset];
            localStorage.setItem('resume_builder_presets', JSON.stringify(updated));
            setSavedPresets(updated);

            localStorage.setItem('resume_builder_data', JSON.stringify(parsedData));
            localStorage.setItem('loaded_preset_label', presetLabel);
          }
          router.push('/builder');
        }} 
      />
    </div>
  );
}
