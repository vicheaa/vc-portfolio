import React from "react";
import { useParams, Link } from "react-router-dom";
import { SEO } from "@/components/shared/SEO";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useProject } from "@/hooks/useProjects";
import { formatDate } from "@/lib/utils";

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = useProject(slug!);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Project not found
          </h1>
          <Link to="/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={project.title}
        description={project.description || ""}
        type="article"
      />

      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <Link
            to="/projects"
            className="text-primary-600 hover:text-primary-700 mb-8 inline-block"
          >
            ← Back to Projects
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {project.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="primary">
                {tag}
              </Badge>
            ))}
          </div>

          {project.images[0] && (
            <img
              src={project.images[0]}
              alt={project.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <p>{project.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full">View Live Site</Button>
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" className="w-full">
                  View Source Code
                </Button>
              </a>
            )}
          </div>

          {project.start_date && (
            <p className="text-gray-600 dark:text-gray-400">
              Started: {formatDate(project.start_date)}
            </p>
          )}
        </div>
      </main>
    </>
  );
};
