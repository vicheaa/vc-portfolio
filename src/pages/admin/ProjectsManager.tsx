import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SEO } from "@/components/shared/SEO";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ImageUpload } from "@/components/shared/ImageUpload";
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "@/hooks/useProjects";
import { generateSlug } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/types";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  tags: z.string(),
  live_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  github_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  start_date: z.string().optional(),
  featured: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export const ProjectsManager: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const { data: projects, isLoading } = useProjects({ featured: undefined });
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      live_url: "",
      github_url: "",
      start_date: "",
      featured: false,
    },
  });

  const openCreateModal = () => {
    setEditingProject(null);
    setUploadedImages([]);
    reset();
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setUploadedImages(project.images);
    setValue("title", project.title);
    setValue("description", project.description || "");
    setValue("tags", project.tags.join(", "));
    setValue("live_url", project.live_url || "");
    setValue("github_url", project.github_url || "");
    setValue("start_date", project.start_date || "");
    setValue("featured", project.featured);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: ProjectFormData) => {
    const projectData = {
      title: data.title,
      slug: editingProject?.slug || generateSlug(data.title),
      description: data.description,
      tags: data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      images: uploadedImages,
      live_url: data.live_url || null,
      github_url: data.github_url || null,
      start_date: data.start_date || null,
      featured: data.featured,
    };

    try {
      if (editingProject) {
        await updateProject.mutateAsync({
          id: editingProject.id,
          updates: projectData,
        });
      } else {
        await createProject.mutateAsync(projectData);
      }
      setIsModalOpen(false);
      reset();
      setUploadedImages([]);
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const handleImageUpload = (url: string) => {
    setUploadedImages((prev) => [...prev, url]);
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <SEO title="Manage Projects" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Projects
            </h1>
            <Button onClick={openCreateModal}>Add New Project</Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects?.map((project) => (
                <Card key={project.id} className="p-6">
                  {project.images[0] && (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <Badge variant="success">Featured</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="primary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {project.start_date && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Started: {formatDate(project.start_date)}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => openEditModal(project)}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(project.id)}
                      className="flex-1"
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {projects && projects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No projects yet. Add your first project!
              </p>
              <Button onClick={openCreateModal}>Add New Project</Button>
            </div>
          )}
        </main>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? "Edit Project" : "Add New Project"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            {...register("title")}
            label="Title"
            error={errors.title?.message}
            placeholder="My Awesome Project"
          />

          <Textarea
            {...register("description")}
            label="Description"
            error={errors.description?.message}
            placeholder="Describe your project..."
            rows={4}
          />

          <Input
            {...register("tags")}
            label="Tags (comma-separated)"
            error={errors.tags?.message}
            placeholder="React, TypeScript, Tailwind"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register("live_url")}
              label="Live URL"
              error={errors.live_url?.message}
              placeholder="https://example.com"
            />

            <Input
              {...register("github_url")}
              label="GitHub URL"
              error={errors.github_url?.message}
              placeholder="https://github.com/..."
            />
          </div>

          <Input
            {...register("start_date")}
            type="date"
            label="Start Date"
            error={errors.start_date?.message}
          />

          <div className="flex items-center gap-2">
            <input
              {...register("featured")}
              type="checkbox"
              id="featured"
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label
              htmlFor="featured"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Featured Project
            </label>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Images
            </label>
            <ImageUpload
              bucket="project-images"
              path="projects"
              onUploadComplete={handleImageUpload}
            />
            {uploadedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {uploadedImages.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Project ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} className="flex-1">
              {editingProject ? "Update" : "Create"} Project
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
