'use client';

interface Props {
  experiences: any[];
}

export default function ExperienceSection({ experiences }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-black uppercase tracking-widest text-indigo-600 border-b border-slate-200 pb-1">
        Experience
      </h2>

      {experiences.map((exp) => (
        <div key={exp.id} className="space-y-1.5">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {exp.position}
              </h3>

              <p className="text-xs text-slate-500 font-semibold">
                {exp.company}
              </p>
            </div>

            <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
            </div>
          </div>

          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
            {exp.bullets?.map((bullet: string, idx: number) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}