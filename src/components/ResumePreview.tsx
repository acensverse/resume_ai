'use client';

import React from 'react';
import { 
  Mail, Phone, MapPin, Globe,
  Star, Cog, TrendingUp, Heart, Lightbulb, Trophy, Target, Zap, 
  Award, BookOpen, Compass, Coffee, Bike, Smile, Leaf, Music, Plus
} from 'lucide-react';

function AchievementIcon({ icon, className = 'w-4 h-4', style }: { icon?: string; className?: string; style?: React.CSSProperties }) {
  switch (icon) {
    case 'star': return <Star className={className} style={style} />;
    case 'cog': return <Cog className={className} style={style} />;
    case 'chart': return <TrendingUp className={className} style={style} />;
    case 'heart': return <Heart className={className} style={style} />;
    case 'bulb': return <Lightbulb className={className} style={style} />;
    case 'trophy': return <Trophy className={className} style={style} />;
    case 'target': return <Target className={className} style={style} />;
    case 'bolt': return <Zap className={className} style={style} />;
    default: return <Award className={className} style={style} />;
  }
}

function PassionIcon({ icon, className = 'w-4 h-4', style }: { icon?: string; className?: string; style?: React.CSSProperties }) {
  switch (icon) {
    case 'leaf': return <Leaf className={className} style={style} />;
    case 'book': return <BookOpen className={className} style={style} />;
    case 'globe': return <Globe className={className} style={style} />;
    case 'music': return <Music className={className} style={style} />;
    case 'coffee': return <Coffee className={className} style={style} />;
    case 'bike': return <Bike className={className} style={style} />;
    case 'smile': return <Smile className={className} style={style} />;
    default: return <Heart className={className} style={style} />;
  }
}

function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth="2" 
      fill="none" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    </svg>
  );
}

function LinkedinIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth="2" 
      fill="none" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

import { ResumeData, Experience, Education, Project, SkillGroup } from '../types/resume';
import { SPACING_SETTINGS, getPaletteColor } from '../utils/templates';

interface ResumePreviewProps {
  data: ResumeData;
}

function SinglePagePreview({ data, pageIndex }: { data: ResumeData, pageIndex: number }) {
  const { 
    personalInfo, experiences, education, projects, skills, settings,
    achievements, passions, languages, courses, certifications, quote 
  } = data;
  const palette = getPaletteColor(settings.primaryColor);

  const hasMainContent = !!(data.personalInfo?.summary || (experiences && experiences.length > 0) || (education && education.length > 0) || (projects && projects.length > 0) || (skills && skills.length > 0));
  const hasExtraDetails = !!((achievements && achievements.length > 0) || 
                          (passions && passions.length > 0) || 
                          (languages && languages.length > 0) || 
                          (courses && courses.length > 0) || 
                          (certifications && certifications.length > 0) || 
                          (quote && quote.text));

  const resumeRef = React.useRef<HTMLDivElement>(null);
  const [pagesCount, setPagesCount] = React.useState(1);

  React.useEffect(() => {
    const checkHeight = () => {
      if (resumeRef.current) {
        // Temporarily reset height to measure natural content height
        const originalHeight = resumeRef.current.style.height;
        resumeRef.current.style.height = 'auto';
        
        const rect = resumeRef.current.getBoundingClientRect();
        const scale = rect.width / 210;
        const heightInMm = rect.height / scale;
        
        // Calculate pages needed (at least 1 page, with a 1.5mm sub-pixel rounding tolerance)
        const pages = Math.max(1, Math.ceil((heightInMm - 1.5) / 297));
        
        // Restore original height
        resumeRef.current.style.height = originalHeight;
        
        setPagesCount(prev => {
          if (pages !== prev) return pages;
          return prev;
        });
      }
    };

    checkHeight();
    
    // Monitor content size changes with a ResizeObserver to trigger height recalcs
    const observer = new ResizeObserver(() => {
      checkHeight();
    });
    
    if (resumeRef.current) {
      observer.observe(resumeRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [data]);

  // Helper to render Achievements
  const renderAchievementsList = (items?: any[], themeColor?: string) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="space-y-3.5">
        {items.map((item) => (
          <div key={item.id} className="flex items-start space-x-3 text-left">
            <div 
              className="p-1.5 rounded-full flex items-center justify-center shrink-0 text-white"
              style={{ backgroundColor: themeColor || palette.hex }}
            >
              <AchievementIcon icon={item.icon} className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-2xs font-bold text-slate-850 leading-tight">{item.title}</h4>
              <p className="text-[10px] text-slate-500 leading-normal">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Helper to render Passions
  const renderPassionsList = (items?: any[], themeColor?: string) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="space-y-3.5">
        {items.map((item) => (
          <div key={item.id} className="flex items-start space-x-3 text-left">
            <div 
              className="p-1.5 rounded-full flex items-center justify-center shrink-0 text-white"
              style={{ backgroundColor: themeColor || palette.hex }}
            >
              <PassionIcon icon={item.icon} className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-2xs font-bold text-slate-850 leading-tight">{item.title}</h4>
              <p className="text-[10px] text-slate-500 leading-normal">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Helper to render Languages
  const renderLanguagesList = (items?: any[], isDarkBg?: boolean) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="grid grid-cols-2 gap-4">
        {items.map((lang) => (
          <div key={lang.id} className="space-y-1 text-left">
            <div className="flex justify-between items-baseline">
              <span className={`text-2xs font-bold ${isDarkBg ? 'text-white' : 'text-slate-850'}`}>{lang.name}</span>
              <span className={`text-[9px] ${isDarkBg ? 'text-slate-300' : 'text-slate-400'} italic font-medium`}>{lang.level}</span>
            </div>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((dot) => (
                <span 
                  key={dot} 
                  className="w-2 h-2 rounded-full border border-current shrink-0" 
                  style={{
                    backgroundColor: dot <= lang.rating ? palette.hex : 'transparent',
                    borderColor: dot <= lang.rating ? palette.hex : (isDarkBg ? '#4b5563' : '#cbd5e1'),
                    opacity: dot <= lang.rating ? 1 : 0.4
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Styling maps based on settings
  const marginClass = settings.margins === 'compact' ? 'p-6' : settings.margins === 'loose' ? 'p-12' : 'p-8';
  
  // Font sizes map (Tightened to fit standard resume density)
  const fontSizePreset = settings.fontSize === 'sm' 
    ? { name: 'text-xl', sectionHeader: 'text-xs', title: 'text-[11px]', body: 'text-[10px]', meta: 'text-[9px]' }
    : settings.fontSize === 'lg'
    ? { name: 'text-3xl', sectionHeader: 'text-base', title: 'text-sm', body: 'text-xs', meta: 'text-[11px]' }
    : { name: 'text-2xl', sectionHeader: 'text-sm', title: 'text-xs', body: 'text-[11px]', meta: 'text-[10px]' }; // md

  // Line spacing & gap class
  const spacingClass = settings.lineSpacing === 'compact' ? 'leading-tight space-y-0.5' : settings.lineSpacing === 'relaxed' ? 'leading-relaxed space-y-2' : 'leading-snug space-y-1';
  const sectionGapClass = settings.lineSpacing === 'compact' ? 'space-y-2' : settings.lineSpacing === 'relaxed' ? 'space-y-5' : 'space-y-3';
  const listGapClass = settings.lineSpacing === 'compact' ? 'space-y-0.5' : settings.lineSpacing === 'relaxed' ? 'space-y-2' : 'space-y-1';

  // Apply font family class
  let fontClass = 'font-sans';
  if (settings.fontFamily === 'font-serif') fontClass = 'font-serif';
  if (settings.fontFamily === 'font-mono') fontClass = 'font-mono';
  if (settings.fontFamily === 'font-outfit') fontClass = 'font-outfit';

  // Format date helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr + '-02'); // Add day to avoid timezone shifting
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Section title resolver
  const getSectionTitle = (sectionKey: string) => {
    if (settings.sectionTitles && settings.sectionTitles[sectionKey]) {
      return settings.sectionTitles[sectionKey];
    }
    // Fallbacks
    switch (sectionKey) {
      case 'experiences':
        return settings.templateId === 'classic' || settings.templateId === 'minimalist'
          ? 'Professional Experience'
          : 'Experience';
      case 'projects':
        return settings.templateId === 'classic' ? 'Key Projects' : 'Projects';
      case 'education':
        return 'Education';
      case 'skills':
        return settings.templateId === 'classic'
          ? 'Skills & expertise'
          : settings.templateId === 'creative'
          ? 'Skills & Tools'
          : settings.templateId === 'minimalist'
          ? 'Skills Summary'
          : 'Skills';
      default:
        return sectionKey;
    }
  };

  // -----------------------------------------------------------------
  // TEMPLATE RENDERING FUNCTIONS
  // -----------------------------------------------------------------

  // 1. MODERN MINIMALIST
  const renderModern = (page: 1 | 2) => {
    if (page === 1) {
      return (
        <div className={`space-y-5 ${fontClass} text-slate-900 bg-white min-h-full`}>
          {pageIndex === 0 ? (
              <>
                {/* Header */}
          <div className="border-b-2 pb-4 flex justify-between items-center" style={{ borderColor: palette.hex }}>
            <div className="flex-grow text-left">
              <h1 className={`${fontSizePreset.name} font-extrabold tracking-tight text-slate-950 uppercase`}>
                {personalInfo.name || 'Your Name'}
              </h1>
              <p className={`${fontSizePreset.title} font-semibold uppercase tracking-wider mt-1`} style={{ color: palette.hex }}>
                {personalInfo.title || 'Professional Title'}
              </p>
              
              {/* Personal Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1 gap-x-4 mt-3 text-slate-600 text-3xs font-medium">
                {personalInfo.email && <div className="flex items-center space-x-1.5"><Mail className="w-3 h-3 text-slate-400" /><span>{personalInfo.email}</span></div>}
                {personalInfo.phone && <div className="flex items-center space-x-1.5"><Phone className="w-3 h-3 text-slate-400" /><span>{personalInfo.phone}</span></div>}
                {personalInfo.location && <div className="flex items-center space-x-1.5"><MapPin className="w-3 h-3 text-slate-400" /><span>{personalInfo.location}</span></div>}
                {personalInfo.website && <div className="flex items-center space-x-1.5"><Globe className="w-3 h-3 text-slate-400" /><span>{personalInfo.website.replace(/^https?:\/\//, '')}</span></div>}
                {personalInfo.github && <div className="flex items-center space-x-1.5"><GithubIcon className="w-3 h-3 text-slate-400" /><span>{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span></div>}
                {personalInfo.linkedin && <div className="flex items-center space-x-1.5"><LinkedinIcon className="w-3 h-3 text-slate-400" /><span>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span></div>}
              </div>
            </div>
            {personalInfo.photoUrl && (
              <img 
                src={personalInfo.photoUrl} 
                alt={personalInfo.name} 
                className="w-16 h-16 rounded-full object-cover border-2 shadow-sm shrink-0 ml-4"
                style={{ borderColor: palette.hex }}
              />
            )}
          </div>
              </>
            ) : null}
      

          {/* Summary */}
          {personalInfo.summary && (
            <div className="space-y-1">
              <p className={`${fontSizePreset.body} text-slate-700 leading-relaxed italic text-left`}>
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Core Ordered Sections */}
          {(settings.sectionOrder || ['experiences', 'education', 'projects', 'skills']).map((sectionId) => {
            if (sectionId === 'experiences' && experiences.length > 0) {
              return (
                <div key="experiences" className="space-y-2">
                  <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5 text-left`} style={{ color: palette.hex }}>
                    {getSectionTitle('experiences')}
                  </h2>
                  <div className={listGapClass}>
                    {experiences.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between items-baseline text-left">
                          <h3 className={`${fontSizePreset.title} font-bold text-slate-900`}>
                            {exp.position} <span className="font-semibold text-slate-500">@ {exp.company}</span>
                          </h3>
                          <span className={`${fontSizePreset.meta} text-slate-500 font-semibold uppercase shrink-0`}>
                            {formatDate(exp.startDate)} &ndash; {exp.current ? 'Present' : formatDate(exp.endDate)}
                          </span>
                        </div>
                        <div className="flex justify-between text-2xs text-slate-500 font-medium italic text-left">
                          <span>{exp.location}</span>
                        </div>
                        <ul className={`list-disc list-outside pl-4 ${fontSizePreset.body} text-slate-700 ${spacingClass} text-left`}>
                          {exp.bullets.filter(Boolean).map((bullet, idx) => (
                            <li key={idx} className="pl-1 text-justify">{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            if (sectionId === 'projects' && projects.length > 0) {
              return (
                <div key="projects" className="space-y-2 text-left">
                  <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5`} style={{ color: palette.hex }}>
                    {getSectionTitle('projects')}
                  </h2>
                  <div className={listGapClass}>
                    {projects.map((proj) => (
                      <div key={proj.id} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <h3 className={`${fontSizePreset.title} font-bold text-slate-900`}>
                            {proj.name}
                            {proj.technologies.length > 0 && (
                              <span className="text-2xs font-semibold text-slate-500 font-normal ml-2">
                                ({proj.technologies.join(', ')})
                              </span>
                            )}
                          </h3>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noreferrer" className={`${fontSizePreset.meta} font-medium text-slate-500 hover:underline hover:text-indigo-600 shrink-0`}>
                              {proj.link.replace(/^https?:\/\/(www\.)?/, '')}
                            </a>
                          )}
                        </div>
                        {proj.description && (
                          <p className={`${fontSizePreset.body} text-slate-600 leading-normal`}>{proj.description}</p>
                        )}
                        {proj.bullets && proj.bullets.length > 0 && proj.bullets[0] && (
                          <ul className={`list-disc list-outside pl-4 ${fontSizePreset.body} text-slate-700 ${spacingClass}`}>
                            {proj.bullets.filter(Boolean).map((bullet, idx) => (
                              <li key={idx} className="pl-1">{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            if (sectionId === 'education' && education.length > 0) {
              return (
                <div key="education" className="space-y-2 text-left">
                  <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5`} style={{ color: palette.hex }}>
                    {getSectionTitle('education')}
                  </h2>
                  <div className={listGapClass}>
                    {education.map((edu) => (
                      <div key={edu.id} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <h3 className={`${fontSizePreset.title} font-bold text-slate-900`}>
                            {edu.school}
                          </h3>
                          <span className={`${fontSizePreset.meta} text-slate-500 font-semibold shrink-0`}>
                            {formatDate(edu.startDate)} &ndash; {edu.current ? 'Present' : formatDate(edu.endDate)}
                          </span>
                        </div>
                        <div className="flex justify-between text-2xs text-slate-600 font-medium">
                          <span>{edu.degree}{edu.major ? ` in ${edu.major}` : ''}</span>
                          <span className="italic">{edu.location}</span>
                        </div>
                        {edu.description && (
                          <p className={`${fontSizePreset.body} text-slate-650 leading-relaxed`}>{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            if (sectionId === 'skills' && skills.length > 0) {
              return (
                <div key="skills" className="space-y-2 text-left">
                  <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5`} style={{ color: palette.hex }}>
                    {getSectionTitle('skills')}
                  </h2>
                  <div className="space-y-1.5">
                    {skills.map((grp) => (
                      <div key={grp.id} className={`${fontSizePreset.body} text-slate-800`}>
                        <strong className="text-slate-900 uppercase text-3xs tracking-wider">{grp.category}:</strong>{' '}
                        {grp.items.join(', ')}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}
        {/* Quote */}
          {quote && quote.text && (
            <div className="space-y-1 text-center italic py-2 border-y border-dashed border-slate-100">
              <p className={`${fontSizePreset.body} text-slate-700 leading-relaxed`}>"{quote.text}"</p>
              {quote.author && <p className="text-[10px] text-slate-500 font-bold font-sans mt-0.5">&mdash; {quote.author}</p>}
            </div>
          )}

{/* Achievements */}
          {achievements && achievements.length > 0 && (
            <div className="space-y-2">
              <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5`} style={{ color: palette.hex }}>
                Achievements
              </h2>
              {renderAchievementsList(achievements, palette.hex)}
            </div>
          )}

          {/* Passions */}
          {passions && passions.length > 0 && (
            <div className="space-y-2">
              <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5`} style={{ color: palette.hex }}>
                Passions
              </h2>
              {renderPassionsList(passions, palette.hex)}
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="space-y-2">
              <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5`} style={{ color: palette.hex }}>
                Languages
              </h2>
              {renderLanguagesList(languages, false)}
            </div>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div className="space-y-2">
              <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5`} style={{ color: palette.hex }}>
                Certifications
              </h2>
              <div className="space-y-2">
                {certifications.map((cert) => (
                  <div key={cert.id} className="space-y-0.5">
                    <h4 className="text-2xs font-bold text-slate-800 leading-tight">{cert.name}</h4>
                    <p className="text-4xs text-slate-400 font-bold uppercase">{cert.provider}</p>
                    {cert.description && <p className="text-4xs text-slate-500 leading-normal">{cert.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courses */}
          {courses && courses.length > 0 && (
            <div className="space-y-2">
              <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5`} style={{ color: palette.hex }}>
                Courses
              </h2>
              <div className="space-y-2">
                {courses.map((course) => (
                  <div key={course.id} className="space-y-0.5">
                    <h4 className="text-2xs font-bold text-slate-800 leading-tight">{course.name}</h4>
                    <p className="text-4xs text-slate-400 font-bold uppercase">{course.provider}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  // 2. CLASSIC EXECUTIVE
  const renderClassic = (page: 1 | 2) => {
    if (page === 1) {
      return (
        <div className={`space-y-5 text-center ${fontClass} text-slate-900 bg-white min-h-full`}>
          {pageIndex === 0 ? (
              <>
                {/* Header */}
          <div className={`border-b pb-3 flex ${personalInfo.photoUrl ? 'justify-between items-center text-left' : 'flex-col items-center text-center'} gap-4`}>
            <div className={`flex-grow space-y-2 ${personalInfo.photoUrl ? 'text-left' : 'text-center'}`}>
              <h1 className={`${fontSizePreset.name} font-serif font-bold text-slate-950 tracking-tight`}>
                {personalInfo.name || 'Your Name'}
              </h1>
              <p className={`${fontSizePreset.title} font-medium tracking-wide uppercase italic`} style={{ color: palette.hex }}>
                {personalInfo.title || 'Professional Title'}
              </p>
              
              {/* Centered inline details separated by bullet */}
              <div className={`flex flex-wrap items-center ${personalInfo.photoUrl ? 'justify-start' : 'justify-center'} gap-x-2 gap-y-1 text-slate-500 text-3xs font-medium`}>
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>{personalInfo.email ? '• ' : ''}{personalInfo.phone}</span>}
                {personalInfo.location && <span>{(personalInfo.email || personalInfo.phone) ? '• ' : ''}{personalInfo.location}</span>}
                {personalInfo.website && <span>{(personalInfo.email || personalInfo.phone || personalInfo.location) ? '• ' : ''}<a href={personalInfo.website} className="hover:underline">{personalInfo.website.replace(/^https?:\/\//, '')}</a></span>}
                {personalInfo.github && <span>{(personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.website) ? '• ' : ''}<a href={personalInfo.github} className="hover:underline">{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</a></span>}
                {personalInfo.linkedin && <span>{(personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.website || personalInfo.github) ? '• ' : ''}<a href={personalInfo.linkedin} className="hover:underline">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</a></span>}
              </div>
            </div>
            {personalInfo.photoUrl && (
              <img 
                src={personalInfo.photoUrl} 
                alt={personalInfo.name} 
                className="w-18 h-18 rounded-full object-cover border-2 shadow-sm shrink-0"
                style={{ borderColor: palette.hex }}
              />
            )}
          </div>
              </>
            ) : null}
      

          {/* Summary */}
          {personalInfo.summary && (
            <div className="text-left">
              <p className={`${fontSizePreset.body} text-slate-700 leading-relaxed text-justify`}>
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Dynamic Ordered Sections */}
          {(settings.sectionOrder || ['experiences', 'education', 'projects', 'skills']).map((sectionId) => {
            if (sectionId === 'experiences' && experiences.length > 0) {
              return (
                <div key="experiences" className="space-y-2.5 text-left">
                  <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider text-center border-b border-double border-slate-300 pb-1`} style={{ color: palette.hex }}>
                    {getSectionTitle('experiences')}
                  </h2>
                  <div className={listGapClass}>
                    {experiences.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between items-baseline font-bold text-slate-950">
                          <span className={fontSizePreset.title}>{exp.company} &ndash; {exp.location}</span>
                          <span className={`${fontSizePreset.meta} uppercase shrink-0`}>
                            {formatDate(exp.startDate)} &ndash; {exp.current ? 'Present' : formatDate(exp.endDate)}
                          </span>
                        </div>
                        <div className={`${fontSizePreset.body} font-bold text-slate-700 italic`}>
                          {exp.position}
                        </div>
                        <ul className={`list-disc list-outside pl-5 ${fontSizePreset.body} text-slate-700 ${spacingClass}`}>
                          {exp.bullets.filter(Boolean).map((bullet, idx) => (
                            <li key={idx} className="pl-0.5 text-justify">{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            if (sectionId === 'projects' && projects.length > 0) {
              return (
                <div key="projects" className="space-y-2.5 text-left">
                  <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider text-center border-b border-double border-slate-300 pb-1`} style={{ color: palette.hex }}>
                    {getSectionTitle('projects')}
                  </h2>
                  <div className={listGapClass}>
                    {projects.map((proj) => (
                      <div key={proj.id} className="space-y-1">
                        <div className="flex justify-between items-baseline font-bold">
                          <span className={fontSizePreset.title}>{proj.name}</span>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noreferrer" className={`${fontSizePreset.meta} font-medium text-slate-500 hover:underline shrink-0`}>
                              {proj.link.replace(/^https?:\/\/(www\.)?/, '')}
                            </a>
                          )}
                        </div>
                        {proj.technologies.length > 0 && (
                          <div className="text-3xs text-slate-500 font-semibold uppercase">
                            Technologies: {proj.technologies.join(', ')}
                          </div>
                        )}
                        {proj.description && (
                          <p className={`${fontSizePreset.body} text-slate-600 leading-normal`}>{proj.description}</p>
                        )}
                        {proj.bullets && proj.bullets.length > 0 && proj.bullets[0] && (
                          <ul className={`list-disc list-outside pl-5 ${fontSizePreset.body} text-slate-700 ${spacingClass}`}>
                            {proj.bullets.filter(Boolean).map((bullet, idx) => (
                              <li key={idx} className="pl-0.5">{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            if (sectionId === 'education' && education.length > 0) {
              return (
                <div key="education" className="space-y-2 text-left">
                  <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider text-center border-b border-double border-slate-300 pb-1`} style={{ color: palette.hex }}>
                    {getSectionTitle('education')}
                  </h2>
                  <div className={listGapClass}>
                    {education.map((edu) => (
                      <div key={edu.id} className="space-y-1">
                        <div className="flex justify-between items-baseline font-semibold text-slate-900">
                          <span className={fontSizePreset.title}>{edu.school} &ndash; {edu.location}</span>
                          <span className={`${fontSizePreset.meta} shrink-0`}>
                            {formatDate(edu.startDate)} &ndash; {formatDate(edu.endDate)}
                          </span>
                        </div>
                        <div className={`${fontSizePreset.body} text-slate-700`}>
                          {edu.degree}{edu.major ? `, Major in ${edu.major}` : ''}
                        </div>
                        {edu.description && (
                          <p className={`${fontSizePreset.body} text-slate-500 italic`}>{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            if (sectionId === 'skills' && skills.length > 0) {
              return (
                <div key="skills" className="space-y-2 text-left">
                  <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider text-center border-b border-double border-slate-300 pb-1`} style={{ color: palette.hex }}>
                    {getSectionTitle('skills')}
                  </h2>
                  <div className="space-y-1">
                    {skills.map((grp) => (
                      <div key={grp.id} className={`${fontSizePreset.body} text-slate-800`}>
                        <strong className="text-slate-950 font-bold">{grp.category}:</strong>{' '}
                        {grp.items.join(', ')}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}
        
          {/* Quote */}
          {quote && quote.text && (
            <div className="space-y-1 text-center italic py-2 border-y border-double border-slate-200">
              <p className={`${fontSizePreset.body} text-slate-700 leading-relaxed font-serif`}>"{quote.text}"</p>
              {quote.author && <p className="text-[10px] text-slate-500 font-bold font-sans mt-0.5">&mdash; {quote.author}</p>}
            </div>
          )}

{/* Achievements */}
          {achievements && achievements.length > 0 && (
            <div className="space-y-2">
              <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider text-center border-b border-double border-slate-300 pb-1`} style={{ color: palette.hex }}>
                Achievements
              </h2>
              {renderAchievementsList(achievements, palette.hex)}
            </div>
          )}

          {/* Passions */}
          {passions && passions.length > 0 && (
            <div className="space-y-2">
              <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider text-center border-b border-double border-slate-300 pb-1`} style={{ color: palette.hex }}>
                Passions
              </h2>
              {renderPassionsList(passions, palette.hex)}
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="space-y-2">
              <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider text-center border-b border-double border-slate-300 pb-1`} style={{ color: palette.hex }}>
                Languages
              </h2>
              {renderLanguagesList(languages, false)}
            </div>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div className="space-y-2">
              <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider text-center border-b border-double border-slate-300 pb-1`} style={{ color: palette.hex }}>
                Certifications
              </h2>
              <div className="space-y-2">
                {certifications.map((cert) => (
                  <div key={cert.id} className="space-y-0.5">
                    <h4 className="text-2xs font-bold text-slate-800 leading-tight">{cert.name}</h4>
                    <p className="text-4xs text-slate-400 font-bold uppercase">{cert.provider}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courses */}
          {courses && courses.length > 0 && (
            <div className="space-y-2">
              <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider text-center border-b border-double border-slate-300 pb-1`} style={{ color: palette.hex }}>
                Courses
              </h2>
              <div className="space-y-2">
                {courses.map((course) => (
                  <div key={course.id} className="space-y-0.5">
                    <h4 className="text-2xs font-bold text-slate-800 leading-tight">{course.name}</h4>
                    <p className="text-4xs text-slate-400 font-bold uppercase">{course.provider}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  // 3. CREATIVE SPLIT COLUMN
  const renderCreative = (page: 1 | 2) => {
    if (page === 1) {
      return (
        <div className={`grid grid-cols-10 min-h-full ${fontClass} text-slate-900 bg-white`}>
          {/* LEFT SIDEBAR (Width: 3/10) */}
          <div 
            className="col-span-3 text-white p-6 space-y-6 flex flex-col justify-between"
            style={{ backgroundColor: palette.hex }}
          >
            <div className="space-y-6 text-left">
              {/* Circular Photo if present */}
              {personalInfo.photoUrl && (
                <div className="flex justify-start py-1">
                  <img 
                    src={personalInfo.photoUrl} 
                    alt={personalInfo.name} 
                    className="w-18 h-18 rounded-full object-cover border-2 border-white/20 shadow-md shrink-0"
                  />
                </div>
              )}

              {/* Header block inside sidebar */}
              <div className="space-y-1">
                <h1 className="text-xl font-black uppercase tracking-tight leading-tight">
                  {personalInfo.name.split(' ')[0]}<br/>
                  <span className="font-light text-slate-100">{personalInfo.name.split(' ').slice(1).join(' ')}</span>
                </h1>
                <p className="text-3xs font-semibold uppercase tracking-widest text-slate-200 border-t border-slate-300/40 pt-1 mt-2">
                  {personalInfo.title}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <h3 className="text-3xs font-bold uppercase tracking-widest text-indigo-100 border-b border-white/20 pb-0.5">Contact</h3>
                <div className="space-y-2 text-3xs font-medium text-slate-100 break-words">
                  {personalInfo.email && <div className="flex items-center space-x-2"><Mail className="w-3.5 h-3.5 shrink-0 opacity-80" /><span>{personalInfo.email}</span></div>}
                  {personalInfo.phone && <div className="flex items-center space-x-2"><Phone className="w-3.5 h-3.5 shrink-0 opacity-80" /><span>{personalInfo.phone}</span></div>}
                  {personalInfo.location && <div className="flex items-center space-x-2"><MapPin className="w-3.5 h-3.5 shrink-0 opacity-80" /><span>{personalInfo.location}</span></div>}
                  {personalInfo.website && <div className="flex items-center space-x-2"><Globe className="w-3.5 h-3.5 shrink-0 opacity-80" /><span className="truncate">{personalInfo.website.replace(/^https?:\/\//, '')}</span></div>}
                  {personalInfo.github && <div className="flex items-center space-x-2"><GithubIcon className="w-3.5 h-3.5 shrink-0 opacity-80" /><span className="truncate">{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span></div>}
                  {personalInfo.linkedin && <div className="flex items-center space-x-2"><LinkedinIcon className="w-3.5 h-3.5 shrink-0 opacity-80" /><span className="truncate">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span></div>}
                </div>
              </div>

              {/* Education */}
              {education.length > 0 && (
                <div className="space-y-3 text-white">
                  <h3 className="text-3xs font-bold uppercase tracking-widest text-indigo-100 border-b border-white/20 pb-0.5">
                    {getSectionTitle('education')}
                  </h3>
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <div key={edu.id} className="space-y-0.5">
                        <h4 className="text-2xs font-bold leading-tight">{edu.degree}</h4>
                        <p className="text-3xs text-indigo-100 leading-tight">{edu.school}</p>
                        <span className="text-4xs text-slate-300 font-semibold">
                          {formatDate(edu.startDate)} &ndash; {formatDate(edu.endDate)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Branding placeholder */}
            <div className="text-center text-4xs opacity-35 font-mono pt-4">
              Generated via ResumeAI
            </div>
          </div>

          {/* RIGHT MAIN PANEL (Width: 7/10) */}
          <div className="col-span-7 p-6 space-y-5 bg-white overflow-y-auto">
            {/* Profile Summary */}
            {personalInfo.summary && (
              <div className="space-y-1.5 text-left">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-0.5" style={{ color: palette.hex }}>
                  Profile Summary
                </h2>
                <p className={`${fontSizePreset.body} text-slate-600 leading-relaxed text-justify`}>
                  {personalInfo.summary}
                </p>
              </div>
            )}

            {/* Dynamic Ordered Sections */}
            {(settings.sectionOrder || ['experiences', 'education', 'projects', 'skills'])
              .filter(sectionId => sectionId !== 'education')
              .map((sectionId) => {
                if (sectionId === 'experiences' && experiences.length > 0) {
                  return (
                    <div key="experiences" className="space-y-3 text-left">
                      <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-0.5" style={{ color: palette.hex }}>
                        {getSectionTitle('experiences')}
                      </h2>
                      <div className={listGapClass}>
                        {experiences.map((exp) => (
                          <div key={exp.id} className="space-y-1">
                            <div className="flex justify-between items-baseline">
                              <h3 className={`${fontSizePreset.title} font-bold text-slate-900`}>
                                {exp.position} <span className="font-semibold text-slate-400">at {exp.company}</span>
                              </h3>
                              <span className="text-4xs text-slate-500 font-bold uppercase shrink-0 ml-4">
                                {formatDate(exp.startDate)} &ndash; {exp.current ? 'Present' : formatDate(exp.endDate)}
                              </span>
                            </div>
                            <p className="text-4xs text-slate-400 italic font-semibold">{exp.location}</p>
                            <ul className={`list-disc list-outside pl-4 ${fontSizePreset.body} text-slate-600 ${spacingClass}`}>
                              {exp.bullets.filter(Boolean).map((bullet, idx) => (
                                <li key={idx} className="pl-0.5 text-justify">{bullet}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                if (sectionId === 'projects' && projects.length > 0) {
                  return (
                    <div key="projects" className="space-y-3 text-left">
                      <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-0.5" style={{ color: palette.hex }}>
                        {getSectionTitle('projects')}
                      </h2>
                      <div className={listGapClass}>
                        {projects.map((proj) => (
                          <div key={proj.id} className="space-y-1">
                            <div className="flex justify-between items-baseline">
                              <h3 className={`${fontSizePreset.title} font-bold text-slate-900`}>
                                {proj.name}
                                {proj.technologies.length > 0 && (
                                  <span className="text-4xs font-bold text-slate-400 ml-1.5">
                                    ({proj.technologies.join(', ')})
                                  </span>
                                )}
                              </h3>
                              {proj.link && (
                                <a href={proj.link} className="text-4xs text-slate-400 hover:underline shrink-0">
                                  {proj.link.replace(/^https?:\/\/(www\.)?/, '')}
                                </a>
                              )}
                            </div>
                            {proj.description && (
                              <p className={`${fontSizePreset.body} text-slate-500 leading-normal`}>{proj.description}</p>
                            )}
                            {proj.bullets && proj.bullets.length > 0 && proj.bullets[0] && (
                              <ul className={`list-disc list-outside pl-4 ${fontSizePreset.body} text-slate-600 ${spacingClass}`}>
                                {proj.bullets.filter(Boolean).map((bullet, idx) => (
                                  <li key={idx} className="pl-0.5">{bullet}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                if (sectionId === 'skills' && skills.length > 0) {
                  return (
                    <div key="skills" className="space-y-2 text-left">
                      <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-0.5" style={{ color: palette.hex }}>
                        {getSectionTitle('skills')}
                      </h2>
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        {skills.map((grp) => (
                          <div key={grp.id} className="space-y-0.5">
                            <h4 className="text-3xs font-extrabold uppercase text-slate-400 tracking-wider leading-none">{grp.category}</h4>
                            <p className="text-4xs text-slate-600 font-medium leading-normal">{grp.items.join(', ')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
          </div>
        
          </div>
      );
    } else {
      // PAGE 2 (Extra Details) in Modern style
      return (
        <div className={`space-y-5 ${fontClass} text-slate-900 bg-white min-h-full text-left`}>
          {/* Header details mini bar */}
          <div className="border-b pb-2 flex justify-between items-center" style={{ borderColor: `${palette.hex}30` }}>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-950">{personalInfo.name}</span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Page 2</span>
          </div>

          {/* Quote */}
          {quote && quote.text && (
            <div className="space-y-1 text-center italic py-2 border-y border-dashed border-slate-100">
              <p className={`${fontSizePreset.body} text-slate-700 leading-relaxed`}>"{quote.text}"</p>
              {quote.author && <p className="text-[10px] text-slate-500 font-bold font-sans mt-0.5">&mdash; {quote.author}</p>}
            </div>
          )}

          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <div className="space-y-2">
              <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5`} style={{ color: palette.hex }}>
                Achievements
              </h2>
              {renderAchievementsList(achievements, palette.hex)}
            </div>
          )}

          {/* Passions */}
          {passions && passions.length > 0 && (
            <div className="space-y-2">
              <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5`} style={{ color: palette.hex }}>
                Passions
              </h2>
              {renderPassionsList(passions, palette.hex)}
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="space-y-2">
              <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5`} style={{ color: palette.hex }}>
                Languages
              </h2>
              {renderLanguagesList(languages, false)}
            </div>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div className="space-y-2">
              <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5`} style={{ color: palette.hex }}>
                Certifications
              </h2>
              <div className="space-y-2">
                {certifications.map((cert) => (
                  <div key={cert.id} className="space-y-0.5">
                    <h4 className="text-2xs font-bold text-slate-800 leading-tight">{cert.name}</h4>
                    <p className="text-4xs text-slate-400 font-bold uppercase">{cert.provider}</p>
                    {cert.description && <p className="text-4xs text-slate-500 leading-normal">{cert.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courses */}
          {courses && courses.length > 0 && (
            <div className="space-y-2">
              <h2 className={`${fontSizePreset.sectionHeader} font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5`} style={{ color: palette.hex }}>
                Courses
              </h2>
              <div className="space-y-2">
                {courses.map((course) => (
                  <div key={course.id} className="space-y-0.5">
                    <h4 className="text-2xs font-bold text-slate-800 leading-tight">{course.name}</h4>
                    <p className="text-4xs text-slate-400 font-bold uppercase">{course.provider}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  // 4. HIGH DENSITY COMPACT (MINIMALIST)
  const renderMinimalist = (page: 1 | 2) => {
    if (page === 1) {
      return (
        <div className={`space-y-4 ${fontClass} text-slate-900 bg-white min-h-full text-left`}>
          {pageIndex === 0 ? (
              <>
                {/* Minimal Header */}
          <div className="flex justify-between items-center border-b pb-2.5">
            <div className="text-left">
              <h1 className={`${fontSizePreset.name} font-bold text-slate-950 uppercase tracking-tight`}>
                {personalInfo.name || 'Your Name'}
              </h1>
              <p className="text-2xs font-semibold tracking-widest text-slate-500 uppercase mt-0.5">
                {personalInfo.title || 'Professional Title'}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Multi-line contact block aligned to the right */}
              <div className="text-right text-4xs text-slate-600 leading-normal font-medium">
                {personalInfo.email && <div>{personalInfo.email}</div>}
                {personalInfo.phone && <div>{personalInfo.phone}</div>}
                {personalInfo.location && <div>{personalInfo.location}</div>}
                <div className="flex items-center justify-end space-x-1.5 mt-0.5 text-slate-500">
                  {personalInfo.website && <a href={personalInfo.website} className="hover:underline">website</a>}
                  {personalInfo.github && <span>/ <a href={personalInfo.github} className="hover:underline">github</a></span>}
                  {personalInfo.linkedin && <span>/ <a href={personalInfo.linkedin} className="hover:underline">linkedin</a></span>}
                </div>
              </div>
              {personalInfo.photoUrl && (
                <img 
                  src={personalInfo.photoUrl} 
                  alt={personalInfo.name} 
                  className="w-14 h-14 rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
                />
              )}
            </div>
          </div>
              </>
            ) : null}
      

          {/* Summary */}
          {personalInfo.summary && (
            <p className={`${fontSizePreset.body} text-slate-700 leading-relaxed text-justify`}>
              {personalInfo.summary}
            </p>
          )}

          {/* Dynamic Ordered Sections */}
          {(settings.sectionOrder || ['experiences', 'education', 'projects', 'skills']).map((sectionId) => {
            if (sectionId === 'experiences' && experiences.length > 0) {
              return (
                <div key="experiences" className="space-y-1.5">
                  <h2 className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 border-b pb-0.5">
                    {getSectionTitle('experiences')}
                  </h2>
                  <div className={listGapClass}>
                    {experiences.map((exp) => (
                      <div key={exp.id} className="space-y-0.5">
                        <div className="flex justify-between items-baseline font-bold text-2xs text-slate-900">
                          <span>{exp.position} &ndash; {exp.company}</span>
                          <span className="text-3xs font-medium text-slate-500 shrink-0">
                            {formatDate(exp.startDate)} &ndash; {exp.current ? 'Present' : formatDate(exp.endDate)}
                          </span>
                        </div>
                        <ul className={`list-disc list-outside pl-4 ${fontSizePreset.body} text-slate-700 ${spacingClass}`}>
                          {exp.bullets.filter(Boolean).map((bullet, idx) => (
                            <li key={idx} className="pl-0.5 text-justify">{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            if (sectionId === 'projects' && projects.length > 0) {
              return (
                <div key="projects" className="space-y-1.5">
                  <h2 className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 border-b pb-0.5">
                    {getSectionTitle('projects')}
                  </h2>
                  <div className={listGapClass}>
                    {projects.map((proj) => (
                      <div key={proj.id} className="space-y-0.5">
                        <div className="flex justify-between items-baseline font-bold text-2xs text-slate-900">
                          <span>{proj.name} <span className="font-normal text-slate-400 text-3xs ml-1">({proj.technologies.join(', ')})</span></span>
                          {proj.link && (
                            <a href={proj.link} className="text-3xs font-normal text-slate-400 hover:underline shrink-0">
                              {proj.link.replace(/^https?:\/\/(www\.)?/, '')}
                            </a>
                          )}
                        </div>
                        {proj.description && (
                          <p className={`${fontSizePreset.body} text-slate-600 leading-normal`}>{proj.description}</p>
                        )}
                        {proj.bullets && proj.bullets.length > 0 && proj.bullets[0] && (
                          <ul className={`list-disc list-outside pl-4 ${fontSizePreset.body} text-slate-700 ${spacingClass}`}>
                            {proj.bullets.filter(Boolean).map((bullet, idx) => (
                              <li key={idx} className="pl-0.5">{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            if (sectionId === 'education' && education.length > 0) {
              return (
                <div key="education" className="space-y-1.5">
                  <h2 className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 border-b pb-0.5">
                    {getSectionTitle('education')}
                  </h2>
                  <div className={listGapClass}>
                    {education.map((edu) => (
                      <div key={edu.id} className="flex justify-between items-baseline text-2xs text-slate-900">
                        <div className="font-bold">
                          {edu.school} &ndash; <span className="font-semibold text-slate-700">{edu.degree}{edu.major ? ` in ${edu.major}` : ''}</span>
                        </div>
                        <div className="text-3xs font-medium text-slate-500 shrink-0">
                          {formatDate(edu.startDate)} &ndash; {formatDate(edu.endDate)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            if (sectionId === 'skills' && skills.length > 0) {
              return (
                <div key="skills" className="space-y-1.5">
                  <h2 className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 border-b pb-0.5">
                    {getSectionTitle('skills')}
                  </h2>
                  <div className="space-y-1">
                    {skills.map((grp) => (
                      <div key={grp.id} className={`${fontSizePreset.body} text-slate-700`}>
                        <strong className="text-slate-950 font-bold uppercase text-3xs tracking-wider">{grp.category}:</strong>{' '}
                        {grp.items.join(', ')}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}
        {/* Quote */}
          {quote && quote.text && (
            <div className="space-y-1 text-center italic py-2 border-y border-slate-100">
              <p className={`${fontSizePreset.body} text-slate-700 leading-relaxed`}>"{quote.text}"</p>
              {quote.author && <p className="text-[10px] text-slate-500 font-bold font-sans mt-0.5">&mdash; {quote.author}</p>}
            </div>
          )}

{/* Achievements */}
          {achievements && achievements.length > 0 && (
            <div className="space-y-1.5">
              <h2 className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 border-b pb-0.5">
                Achievements
              </h2>
              {renderAchievementsList(achievements, palette.hex)}
            </div>
          )}

          {/* Passions */}
          {passions && passions.length > 0 && (
            <div className="space-y-1.5">
              <h2 className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 border-b pb-0.5">
                Passions
              </h2>
              {renderPassionsList(passions, palette.hex)}
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="space-y-1.5">
              <h2 className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 border-b pb-0.5">
                Languages
              </h2>
              {renderLanguagesList(languages, false)}
            </div>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div className="space-y-1.5">
              <h2 className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 border-b pb-0.5">
                Certifications
              </h2>
              <div className="space-y-2">
                {certifications.map((cert) => (
                  <div key={cert.id} className="space-y-0.5">
                    <h4 className="text-2xs font-bold text-slate-800 leading-tight">{cert.name}</h4>
                    <p className="text-4xs text-slate-400 font-bold uppercase">{cert.provider}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courses */}
          {courses && courses.length > 0 && (
            <div className="space-y-1.5">
              <h2 className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 border-b pb-0.5">
                Courses
              </h2>
              <div className="space-y-2">
                {courses.map((course) => (
                  <div key={course.id} className="space-y-0.5">
                    <h4 className="text-2xs font-bold text-slate-800 leading-tight">{course.name}</h4>
                    <p className="text-4xs text-slate-400 font-bold uppercase">{course.provider}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  
  
  
  
  return (
    <div 
      className={`printable-resume w-[210mm] h-[297mm] shadow-2xl bg-white text-black border border-slate-200/50 rounded-sm relative overflow-hidden transition-all duration-200 select-text ${marginClass} ${pageIndex > 0 ? 'resume-page-break' : ''}`}
    >
      <div className="w-full h-full flex flex-col justify-between">
        {settings.templateId === 'classic' && renderClassic(1)}
        {settings.templateId === 'creative' && renderCreative(1)}
        {settings.templateId === 'minimalist' && renderMinimalist(1)}
        {settings.templateId === 'modern' && renderModern(1)}
                                      </div>
    </div>
  );
}


import { paginateResumeData } from '../utils/pagination';

export default function ResumePreview({ data }: { data: ResumeData }) {
  const pages = paginateResumeData(data);
  return (
    <div className="flex flex-col items-center gap-6 w-full print:gap-0 print:space-y-0 print:m-0 print:p-0">
      {pages.map((chunk, i) => (
        <SinglePagePreview key={i} data={chunk} pageIndex={i} />
      ))}
      
      {/* Add Page Placeholder (Hidden in Print) */}
      <div 
        className="w-[210mm] h-24 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-400 hover:bg-slate-50/50 transition-colors cursor-pointer print:hidden group opacity-80 mt-4 mb-12"
        title="Add more content in the blueprint to automatically generate another page"
      >
        <div className="flex flex-col items-center gap-2">
           <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
           <span className="text-xs font-semibold uppercase tracking-widest">New Page Automatically Generated Upon Overflow</span>
        </div>
      </div>
    </div>
  );
}
