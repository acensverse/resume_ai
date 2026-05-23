'use client';

import React from 'react';
import { ResumeData } from '../../types/resume';
import HeaderSection from '../sections/HeaderSection';
import SummarySection from '../sections/SummarySection';
import ExperienceSection from '../sections/ExperienceSection';
import EducationSection from '../sections/EducationSection';
import ProjectsSection from '../sections/ProjectsSection';
import SkillsSection from '../sections/SkillsSection';

interface Props {
  data: ResumeData;
}

// --- Inline section components for the extra fields ---

function AchievementsSection({ achievements }: { achievements: NonNullable<ResumeData['achievements']> }) {
  return (
    <section style={{ marginBottom: 0 }}>
      <h2 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4f46e5', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.6rem' }}>
        Key Achievements
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem' }}>
        {achievements.map((item) => (
          <div key={item.id}>
            <div style={{ fontWeight: 700, fontSize: '0.75rem', color: '#0f172a' }}>{item.title}</div>
            {item.description && (
              <div style={{ fontSize: '0.7rem', color: '#475569', lineHeight: 1.4 }}>{item.description}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function CertificationsSection({ certifications, courses }: {
  certifications: NonNullable<ResumeData['certifications']>;
  courses: NonNullable<ResumeData['courses']>;
}) {
  const hasCerts = certifications.length > 0;
  const hasCourses = courses.length > 0;
  if (!hasCerts && !hasCourses) return null;
  return (
    <section>
      <h2 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4f46e5', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.6rem' }}>
        Certifications & Courses
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem 1.5rem' }}>
        {certifications.map((cert) => (
          <div key={cert.id}>
            <div style={{ fontWeight: 700, fontSize: '0.75rem', color: '#0f172a' }}>{cert.name}</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{cert.provider}</div>
            {cert.description && <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{cert.description}</div>}
          </div>
        ))}
        {courses.map((course) => (
          <div key={course.id}>
            <div style={{ fontWeight: 700, fontSize: '0.75rem', color: '#0f172a' }}>{course.name}</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{course.provider}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LanguagesSection({ languages }: { languages: NonNullable<ResumeData['languages']> }) {
  return (
    <section>
      <h2 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4f46e5', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.6rem' }}>
        Languages
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem 1.5rem' }}>
        {languages.map((lang) => (
          <div key={lang.id} style={{ fontSize: '0.75rem' }}>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>{lang.name}</span>
            <span style={{ color: '#64748b', marginLeft: '0.3rem' }}>— {lang.level}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function PassionsSection({ passions }: { passions: NonNullable<ResumeData['passions']> }) {
  return (
    <section>
      <h2 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4f46e5', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.6rem' }}>
        Interests & Passions
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem 1.5rem' }}>
        {passions.map((p) => (
          <div key={p.id} style={{ fontSize: '0.75rem' }}>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>{p.title}</span>
            {p.description && <span style={{ color: '#64748b', marginLeft: '0.3rem' }}>— {p.description}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}

function QuoteSection({ quote }: { quote: NonNullable<ResumeData['quote']> }) {
  if (!quote.text) return null;
  return (
    <section style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
      <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: '#475569', lineHeight: 1.5, margin: 0 }}>
        "{quote.text}"
      </p>
      {quote.author && (
        <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem', fontWeight: 600 }}>
          — {quote.author}
        </p>
      )}
    </section>
  );
}

// --- Main template ---

export default function ModernTemplate({ data }: Props) {
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
  } = data;

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
        padding: '2rem',
        color: '#0f172a',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
      } as React.CSSProperties}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <HeaderSection data={personalInfo} />
        <SummarySection summary={personalInfo.summary} />

        {experiences.length > 0 && <ExperienceSection experiences={experiences} />}
        {projects.length > 0 && <ProjectsSection projects={projects} />}
        {education.length > 0 && <EducationSection education={education} />}
        {skills.length > 0 && <SkillsSection skills={skills} />}

        {hasAchievements && <AchievementsSection achievements={achievements!} />}
        {hasCerts && (
          <CertificationsSection
            certifications={certifications || []}
            courses={courses || []}
          />
        )}
        {hasLanguages && <LanguagesSection languages={languages!} />}
        {hasPassions && <PassionsSection passions={passions!} />}
        {hasQuote && <QuoteSection quote={quote!} />}
      </div>
    </div>
  );
}