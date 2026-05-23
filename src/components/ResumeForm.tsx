'use client';

import React, { useState } from 'react';
import { 
  User, Briefcase, GraduationCap, FolderGit, Cpu, Palette, 
  Trash2, Plus, ArrowUp, ArrowDown, Sparkles, Layers,
  Award, Languages, Quote, Upload, X
} from 'lucide-react';
import { ResumeData, Experience, Education, Project, SkillGroup } from '../types/resume';
import { FormInput, FormTextArea, AccordionSection, BulletListEditor } from './FormComponents';
import { COLOR_PALETTES, FONTS, TEMPLATES } from '../utils/templates';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onEnhance: (text: string, type: 'bullet' | 'summary' | 'skills', index: number, path: string) => void;
  isEnhancingPath: string | null;
}

export default function ResumeForm({
  data,
  onChange,
  onEnhance,
  isEnhancingPath
}: ResumeFormProps) {
  // Keep track of which main accordion section is open
  const [openSection, setOpenSection] = useState<string>('personal');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? '' : section);
  };

  // Helper to update personal info
  const updatePersonalInfo = (field: keyof typeof data.personalInfo, value: string) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value
      }
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize image to max 300x300 to conserve localStorage space
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 300;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress quality to 80% to keep base64 string size reasonable
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          updatePersonalInfo('photoUrl', dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // -----------------------------------------------------------------
  // EXPERIENCE OPERATIONS
  // -----------------------------------------------------------------
  const addExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: ['']
    };
    onChange({
      ...data,
      experiences: [...data.experiences, newExp]
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    const updated = data.experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onChange({ ...data, experiences: updated });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experiences: data.experiences.filter(exp => exp.id !== id)
    });
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    const list = [...data.experiences];
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= list.length) return;
    [list[index], list[newIdx]] = [list[newIdx], list[index]];
    onChange({ ...data, experiences: list });
  };

  // -----------------------------------------------------------------
  // EDUCATION OPERATIONS
  // -----------------------------------------------------------------
  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      school: '',
      degree: '',
      major: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    onChange({
      ...data,
      education: [...data.education, newEdu]
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    const updated = data.education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onChange({ ...data, education: updated });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter(edu => edu.id !== id)
    });
  };

  const moveEducation = (index: number, direction: 'up' | 'down') => {
    const list = [...data.education];
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= list.length) return;
    [list[index], list[newIdx]] = [list[newIdx], list[index]];
    onChange({ ...data, education: list });
  };

  // -----------------------------------------------------------------
  // PROJECTS OPERATIONS
  // -----------------------------------------------------------------
  const addProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      bullets: [''],
      technologies: [],
      link: ''
    };
    onChange({
      ...data,
      projects: [...data.projects, newProj]
    });
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    const updated = data.projects.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    );
    onChange({ ...data, projects: updated });
  };

  const removeProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter(proj => proj.id !== id)
    });
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    const list = [...data.projects];
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= list.length) return;
    [list[index], list[newIdx]] = [list[newIdx], list[index]];
    onChange({ ...data, projects: list });
  };

  // -----------------------------------------------------------------
  // SKILLS OPERATIONS
  // -----------------------------------------------------------------
  const addSkillGroup = () => {
    const newGroup: SkillGroup = {
      id: `skill-${Date.now()}`,
      category: '',
      items: []
    };
    onChange({
      ...data,
      skills: [...data.skills, newGroup]
    });
  };

  const updateSkillGroup = (id: string, field: keyof SkillGroup, value: any) => {
    const updated = data.skills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    );
    onChange({ ...data, skills: updated });
  };

  const removeSkillGroup = (id: string) => {
    onChange({
      ...data,
      skills: data.skills.filter(skill => skill.id !== id)
    });
  };

  // -----------------------------------------------------------------
  // EXTRA SECTIONS OPERATIONS
  // -----------------------------------------------------------------
  
  // Achievements
  const addAchievement = () => {
    const newAchievement = {
      id: `ach-${Date.now()}`,
      title: '',
      description: '',
      icon: 'star' as any
    };
    onChange({
      ...data,
      achievements: [...(data.achievements || []), newAchievement]
    });
  };

  const updateAchievement = (id: string, field: string, value: any) => {
    const updated = (data.achievements || []).map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, achievements: updated });
  };

  const removeAchievement = (id: string) => {
    onChange({
      ...data,
      achievements: (data.achievements || []).filter(item => item.id !== id)
    });
  };

  // Passions
  const addPassion = () => {
    const newPassion = {
      id: `pass-${Date.now()}`,
      title: '',
      description: '',
      icon: 'heart' as any
    };
    onChange({
      ...data,
      passions: [...(data.passions || []), newPassion]
    });
  };

  const updatePassion = (id: string, field: string, value: any) => {
    const updated = (data.passions || []).map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, passions: updated });
  };

  const removePassion = (id: string) => {
    onChange({
      ...data,
      passions: (data.passions || []).filter(item => item.id !== id)
    });
  };

  // Languages
  const addLanguage = () => {
    const newLanguage = {
      id: `lang-${Date.now()}`,
      name: '',
      level: 'Fluent',
      rating: 4
    };
    onChange({
      ...data,
      languages: [...(data.languages || []), newLanguage]
    });
  };

  const updateLanguage = (id: string, field: string, value: any) => {
    const updated = (data.languages || []).map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, languages: updated });
  };

  const removeLanguage = (id: string) => {
    onChange({
      ...data,
      languages: (data.languages || []).filter(item => item.id !== id)
    });
  };

  // Courses
  const addCourse = () => {
    const newCourse = {
      id: `course-${Date.now()}`,
      name: '',
      provider: ''
    };
    onChange({
      ...data,
      courses: [...(data.courses || []), newCourse]
    });
  };

  const updateCourse = (id: string, field: string, value: any) => {
    const updated = (data.courses || []).map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, courses: updated });
  };

  const removeCourse = (id: string) => {
    onChange({
      ...data,
      courses: (data.courses || []).filter(item => item.id !== id)
    });
  };

  // Certifications
  const addCertification = () => {
    const newCert = {
      id: `cert-${Date.now()}`,
      name: '',
      provider: '',
      description: ''
    };
    onChange({
      ...data,
      certifications: [...(data.certifications || []), newCert]
    });
  };

  const updateCertification = (id: string, field: string, value: any) => {
    const updated = (data.certifications || []).map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, certifications: updated });
  };

  const removeCertification = (id: string) => {
    onChange({
      ...data,
      certifications: (data.certifications || []).filter(item => item.id !== id)
    });
  };

  // Quote
  const updateQuote = (field: string, value: string) => {
    onChange({
      ...data,
      quote: {
        ...(data.quote || { text: '', author: '' }),
        [field]: value
      }
    });
  };

  // -----------------------------------------------------------------
  // STYLE SETTINGS OPERATIONS
  // -----------------------------------------------------------------
  const updateSettings = (field: keyof typeof data.settings, value: string) => {
    onChange({
      ...data,
      settings: {
        ...data.settings,
        [field]: value
      }
    });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const currentOrder = data.settings.sectionOrder || ['experiences', 'education', 'projects', 'skills'];
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= currentOrder.length) return;
    
    const newOrder = [...currentOrder];
    [newOrder[index], newOrder[newIdx]] = [newOrder[newIdx], newOrder[index]];
    
    onChange({
      ...data,
      settings: {
        ...data.settings,
        sectionOrder: newOrder
      }
    });
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    onChange({
      ...data,
      settings: {
        ...data.settings,
        sectionTitles: {
          ...(data.settings.sectionTitles || {}),
          [sectionId]: title
        }
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. PERSONAL DETAILS */}
      <AccordionSection
        title="Personal Information"
        isOpen={openSection === 'personal'}
        onToggle={() => toggleSection('personal')}
        icon={<User className="w-4.5 h-4.5" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Full Name"
            value={data.personalInfo.name}
            onChange={(e) => updatePersonalInfo('name', e.target.value)}
            placeholder="Alex Rivera"
          />
          <FormInput
            label="Professional Title"
            value={data.personalInfo.title}
            onChange={(e) => updatePersonalInfo('title', e.target.value)}
            placeholder="Senior Software Engineer"
          />
          <FormInput
            label="Email Address"
            type="email"
            value={data.personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            placeholder="alex.rivera@gmail.com"
          />
          <FormInput
            label="Phone Number"
            value={data.personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
          <FormInput
            label="Location"
            value={data.personalInfo.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            placeholder="San Francisco, CA"
          />
          <FormInput
            label="Portfolio Website"
            value={data.personalInfo.website}
            onChange={(e) => updatePersonalInfo('website', e.target.value)}
            placeholder="https://alexrivera.dev"
          />
          <FormInput
            label="GitHub URL"
            value={data.personalInfo.github}
            onChange={(e) => updatePersonalInfo('github', e.target.value)}
            placeholder="https://github.com/alexrivera"
          />
          <FormInput
            label="LinkedIn URL"
            value={data.personalInfo.linkedin}
            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/alexrivera"
          />
          {/* Profile Photo Uploader Section */}
          <div className="md:col-span-2 p-4 border border-border bg-card/25 rounded-xl space-y-4">
            <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider block">
              Profile Photo
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Photo Preview Circle */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full border border-border bg-background flex items-center justify-center overflow-hidden shadow-inner relative">
                  {data.personalInfo.photoUrl ? (
                    <img 
                      src={data.personalInfo.photoUrl} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-foreground/30" />
                  )}
                </div>
                {data.personalInfo.photoUrl && (
                  <button
                    type="button"
                    onClick={() => updatePersonalInfo('photoUrl', '')}
                    className="absolute -top-1.5 -right-1.5 p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-md transition duration-150 hover:scale-105"
                    title="Remove Photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Photo Actions */}
              <div className="flex-grow space-y-3 w-full">
                <div className="flex flex-wrap gap-2">
                  <label className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg cursor-pointer transition duration-150 shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                  {data.personalInfo.photoUrl && (
                    <button
                      type="button"
                      onClick={() => updatePersonalInfo('photoUrl', '')}
                      className="flex items-center space-x-1.5 px-4 py-2 border border-border bg-background/50 hover:bg-rose-500/10 hover:text-rose-500 text-foreground/75 text-xs font-semibold rounded-lg transition duration-150"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-foreground/45 leading-normal">
                  Supported formats: JPG, PNG, GIF. Compressed automatically to optimize file size.
                </p>

                {/* Paste URL option */}
                <div className="pt-2 border-t border-border/40">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-semibold text-foreground/50 uppercase tracking-wider shrink-0">
                      Or paste URL
                    </span>
                    <input
                      type="text"
                      value={data.personalInfo.photoUrl || ''}
                      onChange={(e) => updatePersonalInfo('photoUrl', e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="flex-grow px-3 py-1.5 bg-background border border-border rounded-md text-xs text-foreground placeholder-foreground/35 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition duration-150"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
              Professional Summary
            </label>
            <button
              type="button"
              onClick={() => onEnhance(data.personalInfo.summary, 'summary', -1, 'personalInfo.summary')}
              disabled={!data.personalInfo.summary.trim() || isEnhancingPath !== null}
              className={`flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-40 transition ${
                isEnhancingPath === 'personalInfo.summary' ? 'animate-pulse' : ''
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enhance Summary</span>
            </button>
          </div>
          <textarea
            rows={4}
            value={data.personalInfo.summary}
            onChange={(e) => updatePersonalInfo('summary', e.target.value)}
            placeholder="Write a brief intro about your skills, background, and career goals..."
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder-foreground/45 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </AccordionSection>

      {/* 2. EXPERIENCE */}
      <AccordionSection
        title="Work Experience"
        isOpen={openSection === 'experience'}
        onToggle={() => toggleSection('experience')}
        icon={<Briefcase className="w-4.5 h-4.5" />}
      >
        <div className="space-y-6">
          {data.experiences.map((exp, idx) => (
            <div key={exp.id} className="p-4 border border-border bg-background/40 rounded-xl space-y-4 relative">
              {/* Order and delete control block */}
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-bold text-foreground/50">Position #{idx + 1}</span>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => moveExperience(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-foreground/50 hover:text-foreground/80 disabled:opacity-30 transition"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveExperience(idx, 'down')}
                    disabled={idx === data.experiences.length - 1}
                    className="p-1 text-foreground/50 hover:text-foreground/80 disabled:opacity-30 transition"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    className="p-1 text-foreground/50 hover:text-rose-500 transition ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Company Name"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="Tech Corp"
                />
                <FormInput
                  label="Position / Role"
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  placeholder="Full Stack Engineer"
                />
                <FormInput
                  label="Location"
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                  placeholder="San Francisco, CA (or Remote)"
                />
                <div className="grid grid-cols-2 gap-2">
                  <FormInput
                    label="Start Date"
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  />
                  <FormInput
                    label="End Date"
                    type="date"
                    value={exp.endDate}
                    disabled={exp.current}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`current-job-${exp.id}`}
                  checked={exp.current}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    onChange({
                      ...data,
                      experiences: data.experiences.map((item) =>
                        item.id === exp.id ? { ...item, current: checked, ...(checked ? { endDate: '' } : {}) } : item
                      ),
                    });
                  }}
                  className="rounded border-border text-indigo-600 focus:ring-indigo-500 bg-background h-4 w-4"
                />
                <label htmlFor={`current-job-${exp.id}`} className="text-xs text-foreground/60 font-semibold cursor-pointer">
                  I currently work here
                </label>
              </div>

              {/* Bullet list editor */}
              <BulletListEditor
                label="Achievements & Responsibilities"
                bullets={exp.bullets}
                onChange={(bullets) => updateExperience(exp.id, 'bullets', bullets)}
                onEnhanceClick={(text, bIdx) => 
                  onEnhance(text, 'bullet', bIdx, `experiences.${idx}.bullets.${bIdx}`)
                }
                isEnhancingIndex={
                  isEnhancingPath?.startsWith(`experiences.${idx}.bullets.`)
                    ? parseInt(isEnhancingPath.split('.').pop() || '-1')
                    : null
                }
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addExperience}
            className="w-full py-3 border border-dashed border-border rounded-xl text-xs font-semibold text-foreground/60 hover:text-indigo-500 hover:border-indigo-500/30 hover:bg-card/30 flex items-center justify-center space-x-2 transition duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Work Experience</span>
          </button>
        </div>
      </AccordionSection>

      {/* 3. EDUCATION */}
      <AccordionSection
        title="Education"
        isOpen={openSection === 'education'}
        onToggle={() => toggleSection('education')}
        icon={<GraduationCap className="w-4.5 h-4.5" />}
      >
        <div className="space-y-6">
          {data.education.map((edu, idx) => (
            <div key={edu.id} className="p-4 border border-border bg-background/40 rounded-xl space-y-4 relative">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-bold text-foreground/50">Education #{idx + 1}</span>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => moveEducation(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-foreground/50 hover:text-foreground/80 disabled:opacity-30 transition"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveEducation(idx, 'down')}
                    disabled={idx === data.education.length - 1}
                    className="p-1 text-foreground/50 hover:text-foreground/80 disabled:opacity-30 transition"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeEducation(edu.id)}
                    className="p-1 text-foreground/50 hover:text-rose-500 transition ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="School / University"
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                  placeholder="Stanford University"
                />
                <FormInput
                  label="Degree Earned"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="Bachelor of Science"
                />
                <FormInput
                  label="Major / Field of Study"
                  value={edu.major}
                  onChange={(e) => updateEducation(edu.id, 'major', e.target.value)}
                  placeholder="Computer Science"
                />
                <FormInput
                  label="Location"
                  value={edu.location}
                  onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                  placeholder="Stanford, CA"
                />
                <div className="grid grid-cols-2 gap-2">
                  <FormInput
                    label="Start Date"
                    type="date"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  />
                  <FormInput
                    label="End Date"
                    type="date"
                    value={edu.endDate}
                    disabled={edu.current}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <input
                    type="checkbox"
                    id={`current-edu-${edu.id}`}
                    checked={edu.current}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      onChange({
                        ...data,
                        education: data.education.map((item) =>
                          item.id === edu.id ? { ...item, current: checked, ...(checked ? { endDate: '' } : {}) } : item
                        ),
                      });
                    }}
                    className="rounded border-border text-indigo-600 focus:ring-indigo-500 bg-background h-4 w-4"
                  />
                  <label htmlFor={`current-edu-${edu.id}`} className="text-xs text-foreground/60 font-semibold cursor-pointer">
                    I currently study here
                  </label>
                </div>
              </div>

              <FormInput
                label="Achievements / Details (GPA, Clubs)"
                value={edu.description}
                onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                placeholder="Graduated with honors, GPA: 3.8/4.0. Core course focus on algorithms..."
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addEducation}
            className="w-full py-3 border border-dashed border-border rounded-xl text-xs font-semibold text-foreground/60 hover:text-indigo-500 hover:border-indigo-500/30 hover:bg-card/30 flex items-center justify-center space-x-2 transition duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Education</span>
          </button>
        </div>
      </AccordionSection>

      {/* 4. PROJECTS */}
      <AccordionSection
        title="Projects"
        isOpen={openSection === 'projects'}
        onToggle={() => toggleSection('projects')}
        icon={<FolderGit className="w-4.5 h-4.5" />}
      >
        <div className="space-y-6">
          {data.projects.map((proj, idx) => (
            <div key={proj.id} className="p-4 border border-border bg-background/40 rounded-xl space-y-4 relative">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-bold text-foreground/50">Project #{idx + 1}</span>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => moveProject(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-foreground/50 hover:text-foreground/80 disabled:opacity-30 transition"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveProject(idx, 'down')}
                    disabled={idx === data.projects.length - 1}
                    className="p-1 text-foreground/50 hover:text-foreground/80 disabled:opacity-30 transition"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeProject(proj.id)}
                    className="p-1 text-foreground/50 hover:text-rose-500 transition ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Project Title"
                  value={proj.name}
                  onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                  placeholder="TaskGlass App"
                />
                <FormInput
                  label="Project Link (GitHub / Live Demo)"
                  value={proj.link}
                  onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                  placeholder="https://github.com/myusername/project"
                />
              </div>

              <FormInput
                label="Technologies (Comma separated)"
                value={proj.technologies.join(', ')}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  updateProject(proj.id, 'technologies', arr);
                }}
                placeholder="Next.js, TypeScript, Tailwind CSS"
              />

              <FormTextArea
                label="Brief Description"
                value={proj.description}
                onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                placeholder="Short outline of the project scope..."
              />

              {/* Bullet list editor */}
              <BulletListEditor
                label="Key Details & Achievements"
                bullets={proj.bullets}
                onChange={(bullets) => updateProject(proj.id, 'bullets', bullets)}
                onEnhanceClick={(text, bIdx) => 
                  onEnhance(text, 'bullet', bIdx, `projects.${idx}.bullets.${bIdx}`)
                }
                isEnhancingIndex={
                  isEnhancingPath?.startsWith(`projects.${idx}.bullets.`)
                    ? parseInt(isEnhancingPath.split('.').pop() || '-1')
                    : null
                }
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addProject}
            className="w-full py-3 border border-dashed border-border rounded-xl text-xs font-semibold text-foreground/60 hover:text-indigo-500 hover:border-indigo-500/30 hover:bg-card/30 flex items-center justify-center space-x-2 transition duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>
      </AccordionSection>

      {/* 5. SKILLS */}
      <AccordionSection
        title="Skills"
        isOpen={openSection === 'skills'}
        onToggle={() => toggleSection('skills')}
        icon={<Cpu className="w-4.5 h-4.5" />}
      >
        <div className="space-y-4">
          {data.skills.map((group, idx) => (
            <div key={group.id} className="p-4 border border-border bg-background/40 rounded-xl space-y-3 relative group">
              <button
                type="button"
                onClick={() => removeSkillGroup(group.id)}
                className="absolute top-4 right-4 text-foreground/50 hover:text-rose-500 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div className="grid grid-cols-1 gap-3 pr-8">
                <FormInput
                  label="Category Name"
                  value={group.category}
                  onChange={(e) => updateSkillGroup(group.id, 'category', e.target.value)}
                  placeholder="e.g. Languages, Libraries, Tools"
                />
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                      Skills (Comma separated)
                    </label>
                    <button
                      type="button"
                      onClick={() => onEnhance(group.category || 'Software development skills', 'skills', idx, `skills.${idx}.items`)}
                      disabled={isEnhancingPath !== null}
                      className="flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-40 transition"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Suggest Skills</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={group.items.join(', ')}
                    onChange={(e) => {
                      const items = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      updateSkillGroup(group.id, 'items', items);
                    }}
                    placeholder="e.g. React, Next.js, Node.js"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-foreground/45 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                  {group.items.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {group.items.map((item, itemIdx) => (
                        <span key={itemIdx} className="text-xs bg-background border border-border text-foreground px-2 py-0.5 rounded font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSkillGroup}
            className="w-full py-3 border border-dashed border-border rounded-xl text-xs font-semibold text-foreground/60 hover:text-indigo-500 hover:border-indigo-500/30 hover:bg-card/30 flex items-center justify-center space-x-2 transition duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill Category</span>
          </button>
        </div>
      </AccordionSection>

      {/* ACHIEVEMENTS */}
      <AccordionSection
        title="Key Achievements"
        isOpen={openSection === 'achievements'}
        onToggle={() => toggleSection('achievements')}
        icon={<Award className="w-4.5 h-4.5" />}
      >
        <div className="space-y-4">
          {(data.achievements || []).map((ach, idx) => (
            <div key={ach.id} className="p-4 border border-border bg-background/40 rounded-xl space-y-3 relative">
              <button
                type="button"
                onClick={() => removeAchievement(ach.id)}
                className="absolute top-4 right-4 text-foreground/50 hover:text-rose-500 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                <FormInput
                  label="Achievement Title"
                  value={ach.title}
                  onChange={(e) => updateAchievement(ach.id, 'title', e.target.value)}
                  placeholder="e.g. 45% User Acquisition Increase"
                />
                
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Icon Badge</label>
                  <select
                    value={ach.icon || 'star'}
                    onChange={(e) => updateAchievement(ach.id, 'icon', e.target.value)}
                    className="bg-background border border-border text-sm text-foreground rounded-lg px-3.5 py-2 focus:outline-none"
                  >
                    <option value="star">★ Star</option>
                    <option value="cog">⚙ Gears/Process</option>
                    <option value="chart">📈 Growth Chart</option>
                    <option value="heart">♥ Conversion/Customer</option>
                    <option value="bulb">💡 Innovation/Idea</option>
                    <option value="trophy">🏆 Award/Trophy</option>
                    <option value="target">🎯 Goal/Target</option>
                    <option value="bolt">⚡ Risk/Speed</option>
                  </select>
                </div>
              </div>
              
              <FormTextArea
                label="Brief Description"
                value={ach.description}
                onChange={(e) => updateAchievement(ach.id, 'description', e.target.value)}
                placeholder="Describe what initiatives led to this metric..."
              />
            </div>
          ))}
          
          <button
            type="button"
            onClick={addAchievement}
            className="w-full py-3 border border-dashed border-border rounded-xl text-xs font-semibold text-foreground/60 hover:text-indigo-500 hover:border-indigo-500/30 hover:bg-card/30 flex items-center justify-center space-x-2 transition duration-200"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Add Achievement</span>
          </button>
        </div>
      </AccordionSection>

      {/* CERTIFICATIONS & COURSES */}
      <AccordionSection
        title="Certifications & Courses"
        isOpen={openSection === 'certifications'}
        onToggle={() => toggleSection('certifications')}
        icon={<Award className="w-4.5 h-4.5" />}
      >
        <div className="space-y-6">
          {/* Certifications Sub-list */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider block">Certifications</span>
            {(data.certifications || []).map((cert) => (
              <div key={cert.id} className="p-4 border border-border bg-background/40 rounded-xl space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeCertification(cert.id)}
                  className="absolute top-4 right-4 text-foreground/50 hover:text-rose-500 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                  <FormInput
                    label="Certificate Name"
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                    placeholder="e.g. Advanced Google Analytics"
                  />
                  <FormInput
                    label="Provider / Authority"
                    value={cert.provider}
                    onChange={(e) => updateCertification(cert.id, 'provider', e.target.value)}
                    placeholder="e.g. Google / Coursera"
                  />
                </div>
                <FormInput
                  label="Details / Description"
                  value={cert.description || ''}
                  onChange={(e) => updateCertification(cert.id, 'description', e.target.value)}
                  placeholder="Focus points or grade..."
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addCertification}
              className="w-full py-2.5 border border-dashed border-border rounded-xl text-xs font-semibold text-foreground/60 hover:text-indigo-500 hover:border-indigo-500/30 hover:bg-card/30 flex items-center justify-center space-x-2 transition duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Certification</span>
            </button>
          </div>

          <div className="h-px bg-border my-4" />

          {/* Courses Sub-list */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider block">Courses & Training</span>
            {(data.courses || []).map((course) => (
              <div key={course.id} className="p-4 border border-border bg-background/40 rounded-xl space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeCourse(course.id)}
                  className="absolute top-4 right-4 text-foreground/50 hover:text-rose-500 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                  <FormInput
                    label="Course Name"
                    value={course.name}
                    onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                    placeholder="e.g. PMP Prep Course"
                  />
                  <FormInput
                    label="Training Provider"
                    value={course.provider}
                    onChange={(e) => updateCourse(course.id, 'provider', e.target.value)}
                    placeholder="e.g. Project Management Institute"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addCourse}
              className="w-full py-2.5 border border-dashed border-border rounded-xl text-xs font-semibold text-foreground/60 hover:text-indigo-500 hover:border-indigo-500/30 hover:bg-card/30 flex items-center justify-center space-x-2 transition duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Course</span>
            </button>
          </div>
        </div>
      </AccordionSection>

      {/* LANGUAGES & PASSIONS */}
      <AccordionSection
        title="Languages & Passions"
        isOpen={openSection === 'languages_passions'}
        onToggle={() => toggleSection('languages_passions')}
        icon={<Languages className="w-4.5 h-4.5" />}
      >
        <div className="space-y-6">
          {/* Languages */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider block">Languages</span>
            {(data.languages || []).map((lang) => (
              <div key={lang.id} className="p-4 border border-border bg-background/40 rounded-xl space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeLanguage(lang.id)}
                  className="absolute top-4 right-4 text-foreground/50 hover:text-rose-500 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8 items-end">
                  <FormInput
                    label="Language"
                    value={lang.name}
                    onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                    placeholder="e.g. Spanish"
                  />
                  <FormInput
                    label="Level (Native, Fluent, etc.)"
                    value={lang.level}
                    onChange={(e) => updateLanguage(lang.id, 'level', e.target.value)}
                    placeholder="e.g. Native / Conversational"
                  />
                  <div className="flex flex-col space-y-1.5 pb-1">
                    <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Proficiency (1-5)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={lang.rating}
                        onChange={(e) => updateLanguage(lang.id, 'rating', parseInt(e.target.value))}
                        className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-xs font-mono font-bold w-4 text-right">{lang.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addLanguage}
              className="w-full py-2.5 border border-dashed border-border rounded-xl text-xs font-semibold text-foreground/60 hover:text-indigo-500 hover:border-indigo-500/30 hover:bg-card/30 flex items-center justify-center space-x-2 transition duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Language</span>
            </button>
          </div>

          <div className="h-px bg-border my-4" />

          {/* Passions */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider block">Passions & Interests</span>
            {(data.passions || []).map((passion) => (
              <div key={passion.id} className="p-4 border border-border bg-background/40 rounded-xl space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removePassion(passion.id)}
                  className="absolute top-4 right-4 text-foreground/50 hover:text-rose-500 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                  <FormInput
                    label="Interest / Passion"
                    value={passion.title}
                    onChange={(e) => updatePassion(passion.id, 'title', e.target.value)}
                    placeholder="e.g. Sustainable Manufacturing"
                  />
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Icon Badge</label>
                    <select
                      value={passion.icon || 'heart'}
                      onChange={(e) => updatePassion(passion.id, 'icon', e.target.value)}
                      className="bg-background border border-border text-sm text-foreground rounded-lg px-3.5 py-2 focus:outline-none"
                    >
                      <option value="heart">♥ Heart</option>
                      <option value="leaf">🌿 Nature/Leaf</option>
                      <option value="book">📖 Reading/Book</option>
                      <option value="globe">🌐 Travel/Globe</option>
                      <option value="music">🎵 Music</option>
                      <option value="coffee">☕ Coffee</option>
                      <option value="bike">🚲 Sports/Bike</option>
                      <option value="smile">☺ Smile/Social</option>
                    </select>
                  </div>
                </div>
                <FormInput
                  label="Description"
                  value={passion.description}
                  onChange={(e) => updatePassion(passion.id, 'description', e.target.value)}
                  placeholder="Describe your interest briefly..."
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addPassion}
              className="w-full py-2.5 border border-dashed border-border rounded-xl text-xs font-semibold text-foreground/60 hover:text-indigo-500 hover:border-indigo-500/30 hover:bg-card/30 flex items-center justify-center space-x-2 transition duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Passion</span>
            </button>
          </div>
        </div>
      </AccordionSection>

      {/* FAVORITE QUOTE */}
      <AccordionSection
        title="Favorite Quote"
        isOpen={openSection === 'quote'}
        onToggle={() => toggleSection('quote')}
        icon={<Quote className="w-4.5 h-4.5" />}
      >
        <div className="space-y-4">
          <FormTextArea
            label="Quote Text"
            value={data.quote?.text || ''}
            onChange={(e) => updateQuote('text', e.target.value)}
            placeholder="e.g. Quality means doing it right when no one is looking."
          />
          <FormInput
            label="Author / Attribution"
            value={data.quote?.author || ''}
            onChange={(e) => updateQuote('author', e.target.value)}
            placeholder="e.g. Henry Ford"
          />
        </div>
      </AccordionSection>

      {/* 6. SECTION ORDER & HEADINGS */}
      <AccordionSection
        title="Section Order & Headings"
        isOpen={openSection === 'sections'}
        onToggle={() => toggleSection('sections')}
        icon={<Layers className="w-4.5 h-4.5" />}
      >
        <div className="space-y-3">
          <p className="text-xs text-foreground/50 leading-relaxed mb-1">
            Rearrange the order of sections on your resume or customize their heading titles.
          </p>
          
          <div className="space-y-2">
            {(data.settings.sectionOrder || ['experiences', 'education', 'projects', 'skills']).map((sectionId, index, arr) => {
              const displayNames: Record<string, string> = {
                experiences: 'Experiences',
                education: 'Education',
                projects: 'Projects',
                skills: 'Skills'
              };
              
              const currentTitle = data.settings.sectionTitles?.[sectionId] || '';
              
              return (
                <div 
                  key={sectionId} 
                  className="flex items-center space-x-3 p-3 rounded-xl bg-card/35 border border-border/80 hover:border-indigo-500/20 transition duration-150"
                >
                  {/* Up/Down buttons */}
                  <div className="flex flex-col space-y-1">
                    <button
                      type="button"
                      onClick={() => moveSection(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-background/80 text-foreground/60 disabled:opacity-30 disabled:hover:bg-transparent transition"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(index, 'down')}
                      disabled={index === arr.length - 1}
                      className="p-1 rounded hover:bg-background/80 text-foreground/60 disabled:opacity-30 disabled:hover:bg-transparent transition"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  {/* Name and input */}
                  <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                    <div>
                      <span className="text-xs font-semibold text-foreground/75 tracking-wide block">
                        {displayNames[sectionId] || sectionId}
                      </span>
                      <span className="text-[10px] text-foreground/40 font-mono">
                        Original Section
                      </span>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={currentTitle}
                        onChange={(e) => updateSectionTitle(sectionId, e.target.value)}
                        placeholder={`Custom title (e.g. ${displayNames[sectionId]})`}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground placeholder-foreground/35 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AccordionSection>

      {/* 7. STYLE SETTINGS */}
      <AccordionSection
        title="Customization & Styling"
        isOpen={openSection === 'styling'}
        onToggle={() => toggleSection('styling')}
        icon={<Palette className="w-4.5 h-4.5" />}
      >
        <div className="space-y-4">
          {/* Template Selection */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Design Template</span>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => updateSettings('templateId', tmpl.id as any)}
                  className={`p-3 rounded-xl border text-left flex flex-col space-y-1 transition duration-200 ${
                    data.settings.templateId === tmpl.id
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 shadow'
                      : 'border-border hover:border-indigo-500/30 bg-card hover:bg-background text-foreground/60'
                  }`}
                >
                  <span className="text-xs font-semibold">{tmpl.label}</span>
                  <span className="text-xs leading-normal opacity-85">{tmpl.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palettes */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Accent Palette</span>
            <div className="flex flex-wrap gap-2">
              {COLOR_PALETTES.map((palette) => (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => updateSettings('primaryColor', palette.hex)}
                  title={palette.label}
                  className={`w-7 h-7 rounded-full transition relative flex items-center justify-center border-2 ${
                    data.settings.primaryColor === palette.hex
                      ? 'border-white scale-110 shadow-md shadow-black/50'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: palette.hex }}
                >
                  {data.settings.primaryColor === palette.hex && (
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Fonts Selection */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Typography Font</span>
            <div className="grid grid-cols-2 gap-2">
              {FONTS.map((font) => (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => updateSettings('fontFamily', font.id)}
                  className={`p-2.5 rounded-lg border text-xs font-medium text-center transition duration-150 ${
                    data.settings.fontFamily === font.id
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 shadow'
                      : 'border-border hover:border-indigo-500/30 bg-card hover:bg-background text-foreground/60'
                  }`}
                >
                  <span className={font.class}>{font.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Typography details sliders (margin, linespacing, textsize) */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">Font Size</label>
              <select
                value={data.settings.fontSize}
                onChange={(e) => updateSettings('fontSize', e.target.value as any)}
                className="bg-background border border-border text-xs text-foreground rounded px-2.5 py-1.5 focus:outline-none"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">Line Spacing</label>
              <select
                value={data.settings.lineSpacing}
                onChange={(e) => updateSettings('lineSpacing', e.target.value as any)}
                className="bg-background border border-border text-xs text-foreground rounded px-2.5 py-1.5 focus:outline-none"
              >
                <option value="compact">Compact</option>
                <option value="normal">Normal</option>
                <option value="relaxed">Relaxed</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">Page Margins</label>
              <select
                value={data.settings.margins}
                onChange={(e) => updateSettings('margins', e.target.value as any)}
                className="bg-background border border-border text-xs text-foreground rounded px-2.5 py-1.5 focus:outline-none"
              >
                <option value="compact">Compact</option>
                <option value="normal">Normal</option>
                <option value="loose">Loose</option>
              </select>
            </div>
          </div>
        </div>
      </AccordionSection>
    </div>
  );
}
