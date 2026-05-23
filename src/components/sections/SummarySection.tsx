'use client';

interface Props {
  summary?: string;
}

export default function SummarySection({ summary }: Props) {
  if (!summary) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-black uppercase tracking-widest text-indigo-600 border-b border-slate-200 pb-1">
        Professional Summary
      </h2>

      <p className="text-sm text-slate-700 leading-relaxed text-justify">
        {summary}
      </p>
    </section>
  );
}