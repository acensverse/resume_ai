export interface SpacingPreset {
  margin: string;      // A4 page padding
  sectionGap: string;  // Gap between main sections
  itemGap: string;     // Gap between items in experience/education
  lineHeight: string;  // CSS line height class
  fontSize: {
    name: string;
    title: string;
    subtitle: string;
    body: string;
    meta: string;
  };
}

export const COLOR_PALETTES = [
  { id: 'indigo', label: 'Royal Indigo', hex: '#6366f1', text: 'text-indigo-600', bg: 'bg-indigo-600', border: 'border-indigo-600', hover: 'hover:bg-indigo-700' },
  { id: 'teal', label: 'Ocean Teal', hex: '#0f766e', text: 'text-teal-700', bg: 'bg-teal-700', border: 'border-teal-700', hover: 'hover:bg-teal-800' },
  { id: 'emerald', label: 'Forest Emerald', hex: '#059669', text: 'text-emerald-700', bg: 'bg-emerald-700', border: 'border-emerald-700', hover: 'hover:bg-emerald-800' },
  { id: 'crimson', label: 'Crimson Rose', hex: '#be123c', text: 'text-rose-700', bg: 'bg-rose-700', border: 'border-rose-700', hover: 'hover:bg-rose-800' },
  { id: 'slate', label: 'Midnight Slate', hex: '#334155', text: 'text-slate-700', bg: 'bg-slate-700', border: 'border-slate-700', hover: 'hover:bg-slate-800' },
  { id: 'amber', label: 'Amber Gold', hex: '#b45309', text: 'text-amber-700', bg: 'bg-amber-700', border: 'border-amber-700', hover: 'hover:bg-amber-800' }
];

export const FONTS = [
  { id: 'font-sans', label: 'Inter (Sans)', class: 'font-sans' },
  { id: 'font-serif', label: 'Merriweather (Serif)', class: 'font-serif' },
  { id: 'font-mono', label: 'Geist Mono (Technical)', class: 'font-mono' },
  { id: 'font-outfit', label: 'Outfit (Modern Clean)', class: 'font-outfit' }
];

export const TEMPLATES = [
  { id: 'modern', label: 'Modern Minimalist', description: 'Clean layout with bold section headings and elegant timeline dividers.' },
  { id: 'classic', label: 'Classic Executive', description: 'Traditional centered layout with serif fonts, standard for finance, law, or corporate.' },
  { id: 'double-column', label: 'Creative Split', description: 'Dynamic two-column layout with a styled sidebar ideal for creative professionals.' },
  { id: 'minimalist', label: 'High Density Compact', description: 'Maximum space utilization with ultra-clean borders, ideal for rich multi-year profiles.' }
];

export const SPACING_SETTINGS: Record<string, Record<string, string>> = {
  margins: {
    compact: 'p-6',
    normal: 'p-10',
    loose: 'p-14'
  },
  lineSpacing: {
    compact: 'leading-tight space-y-0.5',
    normal: 'leading-normal space-y-1.5',
    relaxed: 'leading-relaxed space-y-2.5'
  },
  fontSize: {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }
};

/**
 * Helper to retrieve palette metadata
 */
export function getPaletteColor(hexOrId: string) {
  const clean = hexOrId.toLowerCase();
  const found = COLOR_PALETTES.find(p => p.id === clean || p.hex === clean);
  return found || COLOR_PALETTES[0];
}
