import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "@/components/shared/SEO";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { useProjects } from "@/hooks/useProjects";
import { ProjectCardSkeleton } from "@/components/ui/LoadingSkeleton";

export const Projects: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: projects, isLoading } = useProjects({
    search: search || undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
  });

  const allTags = Array.from(new Set(projects?.flatMap((p) => p.tags) || []));

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <>
      <SEO
        title="Projects"
        description="Explore my portfolio of web development projects and applications"
      />

      <main className="flex-1 py-12">
        <div className="container">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Projects
          </h1>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            <Input
              type="search"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />

            {allTags.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Filter by tags:
                </p>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className="transition-opacity hover:opacity-80"
                    >
                      <Badge
                        variant={
                          selectedTags.includes(tag) ? "primary" : "default"
                        }
                      >
                        {tag}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects?.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                >
                  <Link to={`/projects/${project.slug}`}>
                    <Card hover className="h-full p-6">
                      {project.images[0] && (
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {project.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="primary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {projects && projects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No projects found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};
