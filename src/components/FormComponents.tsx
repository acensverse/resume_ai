import React from 'react';
import { Trash2, Plus, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormInput({ label, id, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={id} className="text-xs font-semibold text-foreground/65 uppercase tracking-wider">
        {label}
      </label>
      <input
        id={id}
        className={`px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-foreground/45 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ${className}`}
        {...props}
      />
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function FormTextArea({ label, id, className = '', ...props }: TextAreaProps) {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={id} className="text-xs font-semibold text-foreground/65 uppercase tracking-wider">
        {label}
      </label>
      <textarea
        id={id}
        rows={3}
        className={`px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-foreground/45 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 resize-y ${className}`}
        {...props}
      />
    </div>
  );
}

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function AccordionSection({ title, isOpen, onToggle, icon, children }: AccordionSectionProps) {
  return (
    <div className="border border-border/80 rounded-xl overflow-hidden glass-card transition duration-200">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between bg-card/40 hover:bg-card/85 transition duration-200 text-left"
      >
        <div className="flex items-center space-x-3">
          <div className="text-indigo-400">{icon}</div>
          <span className="font-semibold text-sm text-foreground tracking-wide">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-foreground/60" />
        ) : (
          <ChevronDown className="w-4 h-4 text-foreground/60" />
        )}
      </button>
      
      {isOpen && (
        <div className="p-5 border-t border-border/60 bg-background/20 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

interface BulletListEditorProps {
  label: string;
  bullets: string[];
  onChange: (bullets: string[]) => void;
  onEnhanceClick: (text: string, index: number) => void;
  isEnhancingIndex: number | null;
}

export function BulletListEditor({
  label,
  bullets,
  onChange,
  onEnhanceClick,
  isEnhancingIndex
}: BulletListEditorProps) {
  const handleBulletChange = (val: string, idx: number) => {
    const updated = [...bullets];
    updated[idx] = val;
    onChange(updated);
  };

  const addBullet = () => {
    onChange([...bullets, '']);
  };

  const removeBullet = (idx: number) => {
    const updated = bullets.filter((_, i) => i !== idx);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground/65 uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={addBullet}
          className="flex items-center space-x-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Bullet</span>
        </button>
      </div>

      <div className="space-y-2">
        {bullets.map((bullet, idx) => (
          <div key={idx} className="flex items-start space-x-2 group">
            <div className="flex-grow relative">
              <input
                type="text"
                value={bullet}
                onChange={(e) => handleBulletChange(e.target.value, idx)}
                placeholder="Describe achievement (e.g. Led redesign of homepage...)"
                className="w-full pr-10 pl-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-foreground/45 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
              <button
                type="button"
                onClick={() => onEnhanceClick(bullet, idx)}
                disabled={!bullet.trim() || isEnhancingIndex !== null}
                title="Enhance with AI"
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded text-indigo-400 hover:text-indigo-300 hover:bg-panel disabled:opacity-40 disabled:hover:bg-transparent disabled:text-foreground/45 transition duration-150 ${
                  isEnhancingIndex === idx ? 'animate-pulse text-indigo-300' : ''
                }`}
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
            
            <button
              type="button"
              onClick={() => removeBullet(idx)}
              className="p-2 text-foreground/50 hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg transition duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {bullets.length === 0 && (
          <div className="text-center py-4 border border-dashed border-border rounded-lg text-xs text-foreground/50">
            No bullets added yet. Click &quot;Add Bullet&quot; to begin.
          </div>
        )}
      </div>
    </div>
  );
}
