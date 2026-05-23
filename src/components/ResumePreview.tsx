'use client';

import React from 'react';
import { ResumeData } from '../types/resume';

import ModernTemplate from './templates/ModernTemplate';
import AnupamTemplate from './templates/AnupamTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import CreativeTemplate from './templates/CreativeTemplate';

interface ResumePreviewProps {
  data: ResumeData;
}

const templateMap = {
  modern: ModernTemplate,
  'double-column': AnupamTemplate,
  classic: ClassicTemplate,
  creative: CreativeTemplate,
};

export default function ResumePreview({ data }: ResumePreviewProps) {
  const Template =
    templateMap[data.settings.templateId as keyof typeof templateMap] ||
    ModernTemplate;

  return (
    <div className="flex flex-col items-center gap-6 w-full print:block print:bg-transparent print:py-0">
      <Template data={data} />
    </div>
  );
}
