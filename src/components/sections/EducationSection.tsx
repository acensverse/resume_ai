'use client';
interface Props {
  education: any[];
}

export default function EducationSection({ education }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-black uppercase tracking-widest text-indigo-600 border-b border-slate-200 pb-1">
        Education
      </h2>

      {education.map((edu) => (
        <div key={edu.id} className="space-y-1">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {edu.school}
              </h3>

              <p className="text-xs text-slate-500 font-medium">
                {edu.degree}
              </p>
            </div>

            <div className="text-xs text-slate-500 whitespace-nowrap">
              {edu.startDate} - {edu.endDate}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}