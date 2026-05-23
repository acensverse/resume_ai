'use client';

interface Props {
  projects: any[];
}

export default function ProjectsSection({ projects }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-black uppercase tracking-widest text-indigo-600 border-b border-slate-200 pb-1">
        Projects
      </h2>

      {projects.map((project) => (
        <div key={project.id} className="space-y-1">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {project.name}
              </h3>

              <p className="text-xs text-slate-500">
                {project.technologies?.join(', ')}
              </p>
            </div>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-600 hover:underline"
              >
                View
              </a>
            )}
          </div>

          {project.description && (
            <p className="text-sm text-slate-700 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}