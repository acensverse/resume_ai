'use client';

import React from 'react';
import { ResumeData } from '../../types/resume';
import HeaderSection from '../sections/HeaderSection';

interface Props {
  data: ResumeData;
}

const sectionHeading = (title: string) => (
  <h2 style={{
    fontSize: '0.62rem',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.13em',
    color: '#1e3a5f',
    borderBottom: '2px solid #1e3a5f',
    paddingBottom: '0.2rem',
    marginBottom: '0.6rem',
    marginTop: 0,
  }}>
    {title}
  </h2>
);

export default function AnupamTemplate({ data }: Props) {
  const {
    personalInfo,
    experiences,
    education,
    projects,
    skills,
    achievements,
    certifications,
    courses,
  } = data;

  // Flatten all skills items into a categorised list
  const allCerts = [
    ...(certifications || []).map(c => c.name),
    ...(courses || []).map(c => c.name),
  ];

  return (
    <div
      style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: '#ffffff',
        boxSizing: 'border-box',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '0.75rem',
        color: '#1a1a1a',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
      } as React.CSSProperties}
    >
      {/* ── TOP HEADER BAND ── */}
      <div style={{
        backgroundColor: '#1e3a5f',
        color: '#ffffff',
        padding: '1.2rem 1.5rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontSize: '1.6rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: 0,
            lineHeight: 1.1,
            color: '#ffffff',
          }}>
            {personalInfo.name || 'Your Name'}
          </h1>

          {personalInfo.title && (
            <p style={{
              fontSize: '0.78rem',
              fontWeight: 500,
              color: '#a8c4e0',
              margin: '0.2rem 0 0.6rem',
              letterSpacing: '0.04em',
            }}>
              {personalInfo.title}
            </p>
          )}

          {/* Contact row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.15rem 1.2rem',
            fontSize: '0.68rem',
            color: '#cfe0f0',
          }}>
            {personalInfo.email && <span>✉ {personalInfo.email}</span>}
            {personalInfo.phone && <span>✆ {personalInfo.phone}</span>}
            {personalInfo.linkedin && (
              <span>in {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
            )}
            {personalInfo.github && (
              <span>⌥ {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
            )}
            {personalInfo.website && <span>🔗 {personalInfo.website}</span>}
            {personalInfo.location && <span>⌖ {personalInfo.location}</span>}
          </div>
        </div>

        {personalInfo.photoUrl && (
          <div style={{ flexShrink: 0 }}>
            <img 
              src={personalInfo.photoUrl} 
              alt={personalInfo.name} 
              style={{
                width: '4.5rem',
                height: '4.5rem',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #a8c4e0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>
        )}
      </div>

      {/* ── SUMMARY BAND ── */}
      {personalInfo.summary && (
        <div style={{
          backgroundColor: '#eef4fa',
          padding: '0.6rem 1.5rem',
          fontSize: '0.72rem',
          color: '#2d4a6a',
          lineHeight: 1.55,
          borderBottom: '1px solid #cfe0f0',
        }}>
          {personalInfo.summary}
        </div>
      )}

      {/* ── TWO COLUMN BODY ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>

        {/* LEFT MAIN COLUMN */}
        <div style={{
          flex: '1 1 0',
          padding: '1rem 1rem 1rem 1.5rem',
          borderRight: '1px solid #dde8f0',
          minWidth: 0,
        }}>

          {/* WORK EXPERIENCE */}
          {experiences.length > 0 && (
            <section style={{ marginBottom: '1rem' }}>
              {sectionHeading('Work Experience')}
              {experiences.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#0f172a' }}>
                        {exp.position}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 600 }}>
                        {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b', whiteSpace: 'nowrap', marginLeft: '0.5rem', marginTop: '0.1rem' }}>
                      {exp.startDate}{exp.startDate ? ' - ' : ''}{exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  {exp.bullets && exp.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ margin: '0.3rem 0 0 1rem', padding: 0, listStyleType: 'disc' }}>
                      {exp.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} style={{ fontSize: '0.7rem', color: '#334155', lineHeight: 1.45, marginBottom: '0.15rem' }}>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* PROJECTS */}
          {projects.length > 0 && (
            <section style={{ marginBottom: '1rem' }}>
              {sectionHeading('Projects')}
              {projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.75rem', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      {proj.name}
                    </div>
                    {proj.link && (
                      <span style={{ fontSize: '0.65rem', color: '#4f46e5' }}>{proj.link}</span>
                    )}
                  </div>
                  {proj.description && (
                    <div style={{ fontSize: '0.7rem', color: '#334155', lineHeight: 1.45, marginTop: '0.15rem' }}>
                      {proj.description}
                    </div>
                  )}
                  {proj.bullets && proj.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ margin: '0.2rem 0 0 1rem', padding: 0, listStyleType: 'disc' }}>
                      {proj.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} style={{ fontSize: '0.7rem', color: '#334155', lineHeight: 1.4 }}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.2rem' }}>
                      <span style={{ fontWeight: 700 }}>Tech Stack: </span>
                      {proj.technologies.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{
          width: '62mm',
          flexShrink: 0,
          padding: '1rem 1.2rem 1rem 1rem',
          backgroundColor: '#f8fafc',
        }}>

          {/* TECHNICAL SKILLS */}
          {skills.length > 0 && (
            <section style={{ marginBottom: '1rem' }}>
              {sectionHeading('Technical Skills')}
              {skills.map((group) => (
                <div key={group.id} style={{ marginBottom: '0.4rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.68rem', color: '#1e3a5f', marginBottom: '0.1rem' }}>
                    {group.category}:
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#334155', lineHeight: 1.45 }}>
                    {group.items.join(', ')}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* EDUCATION */}
          {education.length > 0 && (
            <section style={{ marginBottom: '1rem' }}>
              {sectionHeading('Education')}
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '0.55rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.72rem', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                    {edu.degree}
                  </div>
                  {edu.major && (
                    <div style={{ fontSize: '0.67rem', color: '#475569' }}>{edu.major}</div>
                  )}
                  <div style={{ fontSize: '0.67rem', color: '#475569' }}>
                    {edu.school}{edu.location ? ` | ${edu.location}` : ''}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                    {edu.startDate}{edu.startDate && edu.endDate ? ' - ' : ''}{edu.endDate}
                  </div>
                  {edu.description && (
                    <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.1rem' }}>{edu.description}</div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* ACHIEVEMENTS */}
          {achievements && achievements.length > 0 && (
            <section style={{ marginBottom: '1rem' }}>
              {sectionHeading('Achievements')}
              {achievements.map((item) => (
                <div key={item.id} style={{ marginBottom: '0.4rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.7rem', color: '#0f172a' }}>{item.title}</div>
                  {item.description && (
                    <div style={{ fontSize: '0.67rem', color: '#475569', lineHeight: 1.4 }}>{item.description}</div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* CERTIFICATES */}
          {allCerts.length > 0 && (
            <section style={{ marginBottom: '1rem' }}>
              {sectionHeading('Certificates')}
              {allCerts.map((name, i) => (
                <div key={i} style={{ fontSize: '0.7rem', color: '#334155', marginBottom: '0.2rem' }}>
                  • {name}
                </div>
              ))}
            </section>
          )}

          {/* LANGUAGES */}
          {data.languages && data.languages.length > 0 && (
            <section style={{ marginBottom: '1rem' }}>
              {sectionHeading('Languages')}
              {data.languages.map((lang) => (
                <div key={lang.id} style={{ fontSize: '0.7rem', color: '#334155', marginBottom: '0.15rem' }}>
                  <span style={{ fontWeight: 700 }}>{lang.name}</span>
                  <span style={{ color: '#94a3b8' }}> — {lang.level}</span>
                </div>
              ))}
            </section>
          )}

          {/* PASSIONS */}
          {data.passions && data.passions.length > 0 && (
            <section style={{ marginBottom: '1rem' }}>
              {sectionHeading('Interests')}
              {data.passions.map((p) => (
                <div key={p.id} style={{ fontSize: '0.7rem', color: '#334155', marginBottom: '0.15rem' }}>
                  • {p.title}
                </div>
              ))}
            </section>
          )}

          {/* QUOTE */}
          {data.quote && data.quote.text && (
            <section>
              {sectionHeading('Quote')}
              <p style={{ fontSize: '0.68rem', fontStyle: 'italic', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                "{data.quote.text}"
              </p>
              {data.quote.author && (
                <p style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.2rem', fontWeight: 600 }}>
                  — {data.quote.author}
                </p>
              )}
            </section>
          )}

        </div>
      </div>
    </div>
  );
}