'use client';

interface Props {
  skills: any[];
}

export default function SkillsSection({ skills }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-black uppercase tracking-widest text-indigo-600 border-b border-slate-200 pb-1">
        Skills
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {skills.map((group) => (
          <div key={group.id}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              {group.category}
            </h3>

            <p className="text-sm text-slate-700 leading-relaxed">
              {group.items.join(', ')}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}