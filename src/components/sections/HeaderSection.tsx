'use client';

import React from 'react';

interface Props {
  data: any;
}

export default function HeaderSection({ data }: Props) {
  return (
    <header
      style={{
        borderBottom: '1.5px solid #e2e8f0',
        paddingBottom: '1.25rem',
        marginBottom: '0.25rem',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
      } as React.CSSProperties}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
        
        {/* Left: name, title, contacts */}
        <div style={{ flex: 1 }}>

          {/* Full Name */}
          <h1
            style={{
              fontSize: '2.25rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              color: '#020617',
              margin: 0,
              padding: 0,
              lineHeight: 1.1,
            }}
          >
            {data.name || ''}
          </h1>

          {/* Professional Title */}
          {data.title && (
            <p
              style={{
                color: '#4f46e5',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontSize: '0.78rem',
                margin: '0.35rem 0 0 0',
                padding: 0,
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact',
              } as React.CSSProperties}
            >
              {data.title}
            </p>
          )}

          {/* Contact details */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              columnGap: '1.25rem',
              rowGap: '0.2rem',
              marginTop: '0.75rem',
              fontSize: '0.7rem',
              color: '#475569',
            }}
          >
            {data.email && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ opacity: 0.6 }}>✉</span> {data.email}
              </span>
            )}
            {data.phone && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ opacity: 0.6 }}>✆</span> {data.phone}
              </span>
            )}
            {data.location && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ opacity: 0.6 }}>⌖</span> {data.location}
              </span>
            )}
            {data.website && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ opacity: 0.6 }}>🔗</span> {data.website}
              </span>
            )}
            {data.linkedin && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ opacity: 0.6, fontSize: '0.65rem', fontWeight: 700 }}>in</span>{' '}
                {data.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
              </span>
            )}
            {data.github && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ opacity: 0.6 }}>⌥</span>{' '}
                {data.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
              </span>
            )}
          </div>
        </div>

        {/* Right: profile photo */}
        {data.photoUrl && (
          <img
            src={data.photoUrl}
            alt={data.name || 'Profile'}
            style={{
              width: '5rem',
              height: '5rem',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #e2e8f0',
              flexShrink: 0,
            }}
          />
        )}
      </div>
    </header>
  );
}