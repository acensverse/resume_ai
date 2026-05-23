const fs = require('fs');

const content = fs.readFileSync('C:/Users/acens/OneDrive/Documents/New folder/src/components/ResumePreview.tsx', 'utf-8');

// I will just use a simple state machine to find the /* Header */ comments and their matching </div>!
let newContent = content;
const headerComments = [
  '/* Header */',
  '/* Minimal Header */',
  '/* Name and Header Details */',
  '/* Header Details */',
  '/* Big Header Banner */'
];

let currentIndex = 0;

for (const comment of headerComments) {
  let startIndex = 0;
  while ((startIndex = newContent.indexOf(comment, startIndex)) !== -1) {
    // Check if this is inside a page === 1 block
    // It's usually inside `if (page === 1) { return ( <div> /* Header */`
    
    // Find the next <div
    const divStart = newContent.indexOf('<div', startIndex);
    
    // Now we must find the matching closing </div>
    let depth = 1;
    let i = divStart + 4;
    while (depth > 0 && i < newContent.length) {
      if (newContent.startsWith('<div', i)) {
        depth++;
      } else if (newContent.startsWith('</div', i)) {
        depth--;
      }
      i++;
    }
    
    const divEnd = i + 5; // include "iv>"
    
    const headerBlock = newContent.substring(startIndex, divEnd);
    
    // Only wrap it if it hasn't been wrapped already
    let wrapped = headerBlock; if (!headerBlock.includes('pageIndex === 0 ?')) {
      wrapped = `
            {pageIndex === 0 ? (
              <>
                ${headerBlock}
              </>
            ) : (
              <div className="border-b pb-2 flex justify-between items-center mb-4 mt-2 px-6" style={{ borderColor: palette.hex + '40' }}>
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">{personalInfo.name}</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Continued</span>
              </div>
            )}
      `;
      newContent = newContent.substring(0, startIndex) + wrapped + newContent.substring(divEnd);
    }
    
    startIndex += wrapped.length;
  }
}

fs.writeFileSync('C:/Users/acens/OneDrive/Documents/New folder/src/components/ResumePreview.tsx', newContent);
console.log('Headers wrapped successfully.');
