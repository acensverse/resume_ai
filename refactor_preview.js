const fs = require('fs');

let content = fs.readFileSync('C:/Users/acens/OneDrive/Documents/New folder/src/components/ResumePreview.tsx', 'utf-8');

// 1. Rename ResumePreview to SinglePagePreview
content = content.replace(
  'export default function ResumePreview({ data }: ResumePreviewProps) {',
  'function SinglePagePreview({ data, pageIndex }: { data: ResumeData, pageIndex: number }) {'
);

// Add hasMainContent
content = content.replace(
  'const hasExtraDetails = !!((achievements && achievements.length > 0) ||',
  `const hasMainContent = !!(data.summary || (experiences && experiences.length > 0) || (education && education.length > 0) || (projects && projects.length > 0) || (skills && skills.length > 0));\n  const hasExtraDetails = !!((achievements && achievements.length > 0) ||`
);

// Update PAGE 1 rendering wrapper
content = content.replace(
  '{/* PAGE 1 */}\n        <div',
  '{/* PAGE 1 */}\n        {hasMainContent && (<div'
);

// Find the end of the PAGE 1 wrapper and add closing brace
// This is fragile, let's use a regex or string replacement.
// Actually, it's easier to just do it via string replacement:
content = content.replace(
  `{settings.templateId === 'navy-header' && renderNavyHeader(1)}
          </div>
        </div>`,
  `{settings.templateId === 'navy-header' && renderNavyHeader(1)}
          </div>
        </div>)}`
);

// Add new ResumePreview export at the end
content += `

import { paginateResumeData } from '../utils/pagination';

export default function ResumePreview({ data }: { data: ResumeData }) {
  const pages = paginateResumeData(data);
  return (
    <div className="flex flex-col items-center gap-6 w-full print:gap-0 print:space-y-0 print:m-0 print:p-0">
      {pages.map((chunk, i) => (
        <SinglePagePreview key={i} data={chunk} pageIndex={i} />
      ))}
    </div>
  );
}
`;

fs.writeFileSync('C:/Users/acens/OneDrive/Documents/New folder/src/components/ResumePreview.tsx', content);
console.log('Refactoring complete.');
