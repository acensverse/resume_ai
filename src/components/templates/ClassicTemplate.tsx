'use client';

import React from 'react';
import { ResumeData } from '../../types/resume';
import { getPaletteColor } from '../../utils/templates';
import { 
  Star, Cog, TrendingUp, Heart, Lightbulb, Trophy, Target, Zap, Award, 
  BookOpen, Globe, Coffee, Bike, Smile, Leaf, Music
} from 'lucide-react';

interface Props {
  data: ResumeData;
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

export default function ClassicTemplate({ data }: Props) {
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

  // Styling maps based on settings
  const marginPadding = settings.margins === 'compact' ? '1.5rem' : settings.margins === 'loose' ? '3rem' : '2.25rem';
  
  const sizes = settings.fontSize === 'sm'
    ? { name: 'text-xl', sectionHeader: 'text-[11px]', title: 'text-2xs', body: 'text-[10px]', meta: 'text-[9px]' }
    : settings.fontSize === 'lg'
    ? { name: 'text-2xl', sectionHeader: 'text-sm', title: 'text-xs', body: 'text-xs', meta: 'text-[11px]' }
    : { name: 'text-2xl', sectionHeader: 'text-xs', title: 'text-2xs', body: 'text-[11px]', meta: 'text-[10px]' }; // md

  const spacingClass = settings.lineSpacing === 'compact' ? 'leading-tight space-y-0.5' : settings.lineSpacing === 'relaxed' ? 'leading-relaxed space-y-2' : 'leading-snug space-y-1.5';
  const itemGapClass = settings.lineSpacing === 'compact' ? 'space-y-2' : settings.lineSpacing === 'relaxed' ? 'space-y-4.5' : 'space-y-3.5';

  let fontClass = 'font-sans';
  if (settings.fontFamily === 'font-serif') fontClass = 'font-serif';
  if (settings.fontFamily === 'font-mono') fontClass = 'font-mono';
  if (settings.fontFamily === 'font-outfit') fontClass = 'font-outfit';

  // Section title helper
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
        padding: marginPadding,
        color: '#1e293b',
        boxSizing: 'border-box',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
      } as React.CSSProperties}
      className={`text-slate-900 bg-white ${fontClass} text-left`}
    >
      <div className="flex flex-col gap-5">
        {/* Centered Header */}
        <header className="text-center border-b pb-4 flex flex-col items-center gap-2">
          {personalInfo.photoUrl && (
            <img 
              src={personalInfo.photoUrl} 
              alt={personalInfo.name} 
              className="w-16 h-16 rounded-full object-cover border-2 shadow-sm shrink-0 mb-1" 
              style={{ borderColor: palette.hex }} 
            />
          )}
          <h1 className={`${sizes.name} font-serif font-bold text-slate-950 tracking-tight`}>
            {personalInfo.name || 'Your Name'}
          </h1>
          {personalInfo.title && (
            <p 
              className="text-xs font-bold tracking-widest uppercase italic" 
              style={{ color: palette.hex }}
            >
              {personalInfo.title}
            </p>
          )}
          {/* Centered contact info row */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-slate-500 text-3xs font-medium mt-1">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.email ? '• ' : ''}{personalInfo.phone}</span>}
            {personalInfo.location && <span>{(personalInfo.email || personalInfo.phone) ? '• ' : ''}{personalInfo.location}</span>}
            {personalInfo.website && (
              <span>
                {(personalInfo.email || personalInfo.phone || personalInfo.location) ? '• ' : ''}
                <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">
                  {personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </span>
            )}
            {personalInfo.github && (
              <span>
                {(personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.website) ? '• ' : ''}
                <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline">
                  {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                </a>
              </span>
            )}
            {personalInfo.linkedin && (
              <span>
                {(personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.website || personalInfo.github) ? '• ' : ''}
                <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
                  {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                </a>
              </span>
            )}
          </div>
        </header>

        {/* Profile Summary */}
        {personalInfo.summary && (
          <div className="space-y-1">
            <p className={`${sizes.body} text-slate-700 leading-relaxed text-justify`}>
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Render sections in ordered list */}
        {(settings.sectionOrder || ['experiences', 'education', 'projects', 'skills']).map((sectionId) => {
          if (sectionId === 'experiences' && experiences.length > 0) {
            return (
              <section key="experiences" className="space-y-2 text-left">
                <h2 
                  className={`${sizes.sectionHeader} font-bold uppercase tracking-wider text-center border-b border-double pb-1`} 
                  style={{ color: palette.hex, borderColor: `${palette.hex}30` }}
                >
                  {getSectionTitle('experiences', 'Professional Experience')}
                </h2>
                <div className={itemGapClass}>
                  {experiences.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline font-bold text-slate-950">
                        <span className={sizes.title}>{exp.company} &ndash; {exp.location}</span>
                        <span className={`${sizes.meta} uppercase shrink-0`}>
                          {formatDate(exp.startDate)} &ndash; {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <div className={`${sizes.body} font-bold text-slate-700 italic`}>
                        {exp.position}
                      </div>
                      {exp.bullets && exp.bullets.filter(Boolean).length > 0 && (
                        <ul className={`list-disc list-outside pl-5 ${sizes.body} text-slate-700 ${spacingClass}`}>
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
              <section key="projects" className="space-y-2 text-left">
                <h2 
                  className={`${sizes.sectionHeader} font-bold uppercase tracking-wider text-center border-b border-double pb-1`} 
                  style={{ color: palette.hex, borderColor: `${palette.hex}30` }}
                >
                  {getSectionTitle('projects', 'Key Projects')}
                </h2>
                <div className={itemGapClass}>
                  {projects.map((proj) => (
                    <div key={proj.id} className="space-y-1">
                      <div className="flex justify-between items-baseline font-bold">
                        <span className={sizes.title}>{proj.name}</span>
                        {proj.link && (
                          <a 
                            href={proj.link} 
                            target="_blank" 
                            rel="noreferrer" 
                            className={`${sizes.meta} font-medium text-slate-500 hover:underline shrink-0`}
                          >
                            {proj.link.replace(/^https?:\/\/(www\.)?/, '')}
                          </a>
                        )}
                      </div>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="text-4xs text-slate-500 font-semibold uppercase">
                          Technologies: {proj.technologies.join(', ')}
                        </div>
                      )}
                      {proj.description && (
                        <p className={`${sizes.body} text-slate-600 leading-normal`}>
                          {proj.description}
                        </p>
                      )}
                      {proj.bullets && proj.bullets.filter(Boolean).length > 0 && (
                        <ul className={`list-disc list-outside pl-5 ${sizes.body} text-slate-700 ${spacingClass}`}>
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
              <section key="education" className="space-y-2 text-left">
                <h2 
                  className={`${sizes.sectionHeader} font-bold uppercase tracking-wider text-center border-b border-double pb-1`} 
                  style={{ color: palette.hex, borderColor: `${palette.hex}30` }}
                >
                  {getSectionTitle('education', 'Education')}
                </h2>
                <div className={itemGapClass}>
                  {education.map((edu) => (
                    <div key={edu.id} className="space-y-1">
                      <div className="flex justify-between items-baseline font-semibold text-slate-900">
                        <span className={sizes.title}>{edu.school} &ndash; {edu.location}</span>
                        <span className={`${sizes.meta} shrink-0`}>
                          {formatDate(edu.startDate)} &ndash; {edu.current ? 'Present' : formatDate(edu.endDate)}
                        </span>
                      </div>
                      <div className={`${sizes.body} text-slate-700`}>
                        {edu.degree}{edu.major ? `, Major in ${edu.major}` : ''}
                      </div>
                      {edu.description && (
                        <p className={`${sizes.body} text-slate-500 italic`}>
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'skills' && skills.length > 0) {
            return (
              <section key="skills" className="space-y-2 text-left">
                <h2 
                  className={`${sizes.sectionHeader} font-bold uppercase tracking-wider text-center border-b border-double pb-1`} 
                  style={{ color: palette.hex, borderColor: `${palette.hex}30` }}
                >
                  {getSectionTitle('skills', 'Skills & Expertise')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                  {skills.map((grp) => (
                    <div key={grp.id} className={`${sizes.body} text-slate-800`}>
                      <strong className="text-slate-950 font-bold">{grp.category}:</strong>{' '}
                      <span>{grp.items.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          return null;
        })}

        {/* Dynamic Achievements */}
        {hasAchievements && (
          <section className="space-y-2 text-left">
            <h2 
              className={`${sizes.sectionHeader} font-bold uppercase tracking-wider text-center border-b border-double pb-1`} 
              style={{ color: palette.hex, borderColor: `${palette.hex}30` }}
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

        {/* Dynamic Passions */}
        {hasPassions && (
          <section className="space-y-2 text-left">
            <h2 
              className={`${sizes.sectionHeader} font-bold uppercase tracking-wider text-center border-b border-double pb-1`} 
              style={{ color: palette.hex, borderColor: `${palette.hex}30` }}
            >
              Interests & Passions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {passions.map((item) => (
                <div key={item.id} className="flex items-start space-x-3 text-left">
                  <div 
                    className="p-1.5 rounded-full flex items-center justify-center shrink-0 text-white"
                    style={{ backgroundColor: palette.hex }}
                  >
                    <PassionIcon icon={item.icon} className="w-3.5 h-3.5" />
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

        {/* Dynamic Languages */}
        {hasLanguages && (
          <section className="space-y-2 text-left">
            <h2 
              className={`${sizes.sectionHeader} font-bold uppercase tracking-wider text-center border-b border-double pb-1`} 
              style={{ color: palette.hex, borderColor: `${palette.hex}30` }}
            >
              Languages
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {languages.map((lang) => (
                <div key={lang.id} className="space-y-1 text-left">
                  <div className="flex justify-between items-baseline pr-4">
                    <span className="text-2xs font-bold text-slate-900">{lang.name}</span>
                    <span className="text-[9px] text-slate-400 italic font-medium">{lang.level}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <span 
                        key={dot} 
                        className="w-1.5 h-1.5 rounded-full border shrink-0" 
                        style={{
                          backgroundColor: dot <= lang.rating ? palette.hex : 'transparent',
                          borderColor: dot <= lang.rating ? palette.hex : '#cbd5e1',
                          opacity: dot <= lang.rating ? 1 : 0.4
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications and Courses */}
        {hasCerts && (
          <section className="space-y-2 text-left">
            <h2 
              className={`${sizes.sectionHeader} font-bold uppercase tracking-wider text-center border-b border-double pb-1`} 
              style={{ color: palette.hex, borderColor: `${palette.hex}30` }}
            >
              Certifications & Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              {certifications && certifications.map((cert) => (
                <div key={cert.id} className="space-y-0.5">
                  <h4 className="text-2xs font-bold text-slate-800 leading-tight">{cert.name}</h4>
                  <p className="text-4xs text-slate-400 font-bold uppercase">{cert.provider}</p>
                  {cert.description && <p className="text-4xs text-slate-500 leading-normal">{cert.description}</p>}
                </div>
              ))}
              {courses && courses.map((course) => (
                <div key={course.id} className="space-y-0.5">
                  <h4 className="text-2xs font-bold text-slate-800 leading-tight">{course.name}</h4>
                  <p className="text-4xs text-slate-400 font-bold uppercase">{course.provider}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Favorite Quote */}
        {hasQuote && (
          <section className="py-2 border-y border-double text-center" style={{ borderColor: `${palette.hex}30` }}>
            <p className={`${sizes.body} text-slate-700 leading-relaxed font-serif italic`}>
              "{quote.text}"
            </p>
            {quote.author && (
              <p className="text-[10px] text-slate-500 font-bold mt-1">
                &mdash; {quote.author}
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
