'use client';

import React from 'react';
import { ResumeData } from '../../types/resume';
import { getPaletteColor } from '../../utils/templates';
import { 
  Mail, Phone, MapPin, Globe, Star, Cog, TrendingUp, Heart, Lightbulb, 
  Trophy, Target, Zap, Award, BookOpen, Compass, Coffee, Bike, Smile, 
  Leaf, Music
} from 'lucide-react';

interface Props {
  data: ResumeData;
}

function GithubIcon({ className = 'w-3 h-3', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth="2" 
      fill="none" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      style={style}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    </svg>
  );
}

function LinkedinIcon({ className = 'w-3 h-3', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth="2" 
      fill="none" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      style={style}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function AchievementIcon({ icon, className = 'w-3.5 h-3.5', style }: { icon?: string; className?: string; style?: React.CSSProperties }) {
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

function PassionIcon({ icon, className = 'w-3.5 h-3.5', style }: { icon?: string; className?: string; style?: React.CSSProperties }) {
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

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const isMonthOnly = dateStr.split('-').length === 2;
    const dateStringToParse = isMonthOnly ? `${dateStr}-02T12:00:00Z` : `${dateStr}T12:00:00Z`;
    const date = new Date(dateStringToParse);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  } catch {
    return dateStr;
  }
};

export default function CreativeTemplate({ data }: Props) {
  const {
    personalInfo,
    experiences,
    education,
    projects,
    skills,
    achievements,
    certifications,
    courses,
    languages,
    passions,
    quote,
    settings
  } = data;

  const palette = getPaletteColor(settings.primaryColor);

  // Dynamic spacing
  const marginPadding = settings.margins === 'compact' ? '1.25rem' : settings.margins === 'loose' ? '2.5rem' : '1.75rem';
  
  const sizes = settings.fontSize === 'sm'
    ? { sectionHeader: 'text-2xs', title: 'text-2xs', body: 'text-[10px]', meta: 'text-[9px]' }
    : settings.fontSize === 'lg'
    ? { sectionHeader: 'text-sm', title: 'text-xs', body: 'text-xs', meta: 'text-[11px]' }
    : { sectionHeader: 'text-xs', title: 'text-2xs', body: 'text-[11px]', meta: 'text-[10px]' }; // md

  const spacingClass = settings.lineSpacing === 'compact' ? 'leading-tight space-y-0.5' : settings.lineSpacing === 'relaxed' ? 'leading-relaxed space-y-2' : 'leading-snug space-y-1.5';
  const itemGapClass = settings.lineSpacing === 'compact' ? 'space-y-2' : settings.lineSpacing === 'relaxed' ? 'space-y-5' : 'space-y-3.5';

  let fontClass = 'font-sans';
  if (settings.fontFamily === 'font-serif') fontClass = 'font-serif';
  if (settings.fontFamily === 'font-mono') fontClass = 'font-mono';
  if (settings.fontFamily === 'font-outfit') fontClass = 'font-outfit';

  const getSectionTitle = (sectionKey: string, defaultVal: string) => {
    if (settings.sectionTitles && settings.sectionTitles[sectionKey]) {
      return settings.sectionTitles[sectionKey];
    }
    return defaultVal;
  };

  const hasAchievements = achievements && achievements.length > 0;
  const hasCerts = (certifications && certifications.length > 0) || (courses && courses.length > 0);
  const hasLanguages = languages && languages.length > 0;
  const hasPassions = passions && passions.length > 0;
  const hasQuote = quote && quote.text;

  return (
    <div
      style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: '#ffffff',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        boxSizing: 'border-box',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
      } as React.CSSProperties}
      className={`${fontClass} text-slate-900 bg-white text-left flex items-stretch`}
    >
      {/* LEFT SIDEBAR: Width 30% */}
      <div 
        style={{ 
          backgroundColor: palette.hex, 
          padding: marginPadding,
          width: '32%',
        }}
        className="text-white flex flex-col gap-6 shrink-0"
      >
        {/* Profile Image, Name & Title */}
        <div className="flex flex-col items-start gap-3">
          {personalInfo.photoUrl && (
            <img 
              src={personalInfo.photoUrl} 
              alt={personalInfo.name} 
              className="w-20 h-20 rounded-full object-cover border-2 border-white/20 shadow-md shrink-0" 
            />
          )}
          <div className="space-y-1">
            <h1 className="text-xl font-black uppercase tracking-tight leading-tight">
              {personalInfo.name ? personalInfo.name.split(' ')[0] : 'Your'}<br/>
              <span className="font-light text-slate-100">
                {personalInfo.name ? personalInfo.name.split(' ').slice(1).join(' ') : 'Name'}
              </span>
            </h1>
            {personalInfo.title && (
              <p className="text-4xs font-bold uppercase tracking-widest text-white/80">
                {personalInfo.title}
              </p>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-[10px] text-white/85">
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 shrink-0 text-white/70" />
              <span className="break-all">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 shrink-0 text-white/70" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-white/70" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 shrink-0 text-white/70" />
              <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline break-all">
                {personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-2">
              <GithubIcon className="w-3.5 h-3.5 shrink-0 text-white/70" />
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline break-all">
                {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
              </a>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2">
              <LinkedinIcon className="w-3.5 h-3.5 shrink-0 text-white/70" />
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline break-all">
                {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
              </a>
            </div>
          )}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-3xs font-extrabold uppercase tracking-widest text-white/60 border-b border-white/20 pb-1">
              {getSectionTitle('skills', 'Skills & Tools')}
            </h2>
            <div className="space-y-2">
              {skills.map((grp) => (
                <div key={grp.id} className="space-y-0.5">
                  <h4 className="text-[10px] font-extrabold uppercase text-white/60 tracking-wider leading-none">
                    {grp.category}
                  </h4>
                  <p className="text-4xs text-white/90 font-medium leading-relaxed">
                    {grp.items.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {hasLanguages && (
          <div className="space-y-3">
            <h2 className="text-3xs font-extrabold uppercase tracking-widest text-white/60 border-b border-white/20 pb-1">
              Languages
            </h2>
            <div className="space-y-2">
              {languages.map((lang) => (
                <div key={lang.id} className="space-y-0.5 text-left">
                  <div className="flex justify-between items-baseline">
                    <span className="text-4xs font-bold text-white">{lang.name}</span>
                    <span className="text-[8px] text-white/70 italic font-medium">{lang.level}</span>
                  </div>
                  <div className="flex items-center space-x-1 mt-0.5">
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <span 
                        key={dot} 
                        className="w-1.5 h-1.5 rounded-full border shrink-0" 
                        style={{
                          backgroundColor: dot <= lang.rating ? '#ffffff' : 'transparent',
                          borderColor: '#ffffff',
                          opacity: dot <= lang.rating ? 1 : 0.25
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Passions */}
        {hasPassions && (
          <div className="space-y-3">
            <h2 className="text-3xs font-extrabold uppercase tracking-widest text-white/60 border-b border-white/20 pb-1">
              Passions
            </h2>
            <div className="space-y-2">
              {passions.map((item) => (
                <div key={item.id} className="flex items-start space-x-2 text-left">
                  <div className="p-1 bg-white/10 rounded flex items-center justify-center shrink-0">
                    <PassionIcon icon={item.icon} className="w-3 h-3 text-white" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-[10px] font-bold text-white leading-tight">{item.title}</h4>
                    {item.description && (
                      <p className="text-[9px] text-white/75 leading-normal">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT MAIN COLUMN: Width 70% */}
      <div 
        style={{ 
          padding: marginPadding,
          width: '68%',
        }}
        className="flex flex-col gap-6"
      >
        {/* Professional Summary */}
        {personalInfo.summary && (
          <div className="pb-3 border-b border-slate-100">
            <p className={`${sizes.body} text-slate-600 leading-relaxed italic text-justify`}>
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Dynamic Main Columns */}
        {(settings.sectionOrder || ['experiences', 'education', 'projects']).map((sectionId) => {
          if (sectionId === 'experiences' && experiences.length > 0) {
            return (
              <section key="experiences" className="space-y-3 text-left">
                <h2 
                  className="text-xs font-black uppercase tracking-wider border-b pb-0.5" 
                  style={{ color: palette.hex, borderColor: `${palette.hex}20` }}
                >
                  {getSectionTitle('experiences', 'Experience')}
                </h2>
                <div className={itemGapClass}>
                  {experiences.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className={`${sizes.title} font-bold text-slate-900`}>
                          {exp.position} <span className="font-normal text-slate-500">at {exp.company}</span>
                        </h3>
                        <span className={`${sizes.meta} text-slate-500 font-semibold uppercase shrink-0`}>
                          {formatDate(exp.startDate)} &ndash; {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <p className="text-4xs text-slate-400 font-semibold italic">{exp.location}</p>
                      {exp.bullets && exp.bullets.filter(Boolean).length > 0 && (
                        <ul className={`list-disc list-outside pl-4 ${sizes.body} text-slate-650 ${spacingClass}`}>
                          {exp.bullets.filter(Boolean).map((bullet, idx) => (
                            <li key={idx} className="pl-0.5 text-justify">{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'projects' && projects.length > 0) {
            return (
              <section key="projects" className="space-y-3 text-left">
                <h2 
                  className="text-xs font-black uppercase tracking-wider border-b pb-0.5" 
                  style={{ color: palette.hex, borderColor: `${palette.hex}20` }}
                >
                  {getSectionTitle('projects', 'Projects')}
                </h2>
                <div className={itemGapClass}>
                  {projects.map((proj) => (
                    <div key={proj.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className={`${sizes.title} font-bold text-slate-900`}>
                          {proj.name}
                          {proj.technologies && proj.technologies.length > 0 && (
                            <span className="text-4xs font-normal text-slate-400 ml-2">
                              ({proj.technologies.join(', ')})
                            </span>
                          )}
                        </h3>
                        {proj.link && (
                          <a 
                            href={proj.link} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-4xs text-slate-400 hover:underline hover:text-slate-600 shrink-0"
                          >
                            {proj.link.replace(/^https?:\/\/(www\.)?/, '')}
                          </a>
                        )}
                      </div>
                      {proj.description && (
                        <p className={`${sizes.body} text-slate-500 leading-normal`}>
                          {proj.description}
                        </p>
                      )}
                      {proj.bullets && proj.bullets.filter(Boolean).length > 0 && (
                        <ul className={`list-disc list-outside pl-4 ${sizes.body} text-slate-600 ${spacingClass}`}>
                          {proj.bullets.filter(Boolean).map((bullet, idx) => (
                            <li key={idx} className="pl-0.5">{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'education' && education.length > 0) {
            return (
              <section key="education" className="space-y-3 text-left">
                <h2 
                  className="text-xs font-black uppercase tracking-wider border-b pb-0.5" 
                  style={{ color: palette.hex, borderColor: `${palette.hex}20` }}
                >
                  {getSectionTitle('education', 'Education')}
                </h2>
                <div className={itemGapClass}>
                  {education.map((edu) => (
                    <div key={edu.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className={`${sizes.title} font-bold text-slate-900`}>{edu.school}</h3>
                        <span className={`${sizes.meta} text-slate-500 font-semibold shrink-0`}>
                          {formatDate(edu.startDate)} &ndash; {edu.current ? 'Present' : formatDate(edu.endDate)}
                        </span>
                      </div>
                      <div className="flex justify-between text-2xs text-slate-600 font-medium">
                        <span>{edu.degree}{edu.major ? ` in ${edu.major}` : ''}</span>
                        <span className="italic">{edu.location}</span>
                      </div>
                      {edu.description && (
                        <p className={`${sizes.body} text-slate-500 leading-normal`}>
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          return null;
        })}

        {/* Dynamic Achievements (if not displayed in sidebar) */}
        {hasAchievements && !skills.length && (
          <section className="space-y-3 text-left">
            <h2 
              className="text-xs font-black uppercase tracking-wider border-b pb-0.5" 
              style={{ color: palette.hex, borderColor: `${palette.hex}20` }}
            >
              Key Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((item) => (
                <div key={item.id} className="flex items-start space-x-3 text-left">
                  <div 
                    className="p-1.5 rounded-full flex items-center justify-center shrink-0 text-white"
                    style={{ backgroundColor: palette.hex }}
                  >
                    <AchievementIcon icon={item.icon} className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-2xs font-bold text-slate-900 leading-tight">{item.title}</h4>
                    {item.description && (
                      <p className="text-[10px] text-slate-500 leading-normal">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Courses (if present) */}
        {hasCerts && (
          <section className="space-y-3 text-left">
            <h2 
              className="text-xs font-black uppercase tracking-wider border-b pb-0.5" 
              style={{ color: palette.hex, borderColor: `${palette.hex}20` }}
            >
              Certifications & Training
            </h2>
            <div className="grid grid-cols-1 gap-2.5">
              {certifications && certifications.map((c) => (
                <div key={c.id} className="space-y-0.5">
                  <h4 className="text-2xs font-bold text-slate-800 leading-tight">{c.name}</h4>
                  <p className="text-4xs text-slate-400 font-bold uppercase">{c.provider}</p>
                  {c.description && <p className="text-4xs text-slate-500 leading-normal">{c.description}</p>}
                </div>
              ))}
              {courses && courses.map((c) => (
                <div key={c.id} className="space-y-0.5">
                  <h4 className="text-2xs font-bold text-slate-800 leading-tight">{c.name}</h4>
                  <p className="text-4xs text-slate-400 font-bold uppercase">{c.provider}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Favorite Quote */}
        {hasQuote && (
          <section className="py-2.5 border-y border-dashed border-slate-200 text-center">
            <p className={`${sizes.body} text-slate-600 leading-relaxed italic`}>
              "{quote.text}"
            </p>
            {quote.author && (
              <p className="text-[10px] text-slate-450 font-bold mt-1">
                &mdash; {quote.author}
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
