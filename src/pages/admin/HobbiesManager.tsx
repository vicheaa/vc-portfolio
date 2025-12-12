import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SEO } from "@/components/shared/SEO";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { ImageUpload } from "@/components/shared/ImageUpload";
import {
  useHobbies,
  useCreateHobby,
  useUpdateHobby,
  useDeleteHobby,
} from "@/hooks/useHobbies";
import { formatDate } from "@/lib/utils";
import type { Hobby } from "@/types";

const hobbySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().optional(),
});

type HobbyFormData = z.infer<typeof hobbySchema>;

export const HobbiesManager: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHobby, setEditingHobby] = useState<Hobby | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const { data: hobbies, isLoading } = useHobbies();
  const createHobby = useCreateHobby();
  const updateHobby = useUpdateHobby();
  const deleteHobby = useDeleteHobby();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<HobbyFormData>({
    resolver: zodResolver(hobbySchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
    },
  });

  const openCreateModal = () => {
    setEditingHobby(null);
    setUploadedImages([]);
    reset();
    setIsModalOpen(true);
  };

  const openEditModal = (hobby: Hobby) => {
    setEditingHobby(hobby);
    setUploadedImages(hobby.images);
    setValue("title", hobby.title);
    setValue("description", hobby.description || "");
    setValue("date", hobby.date || "");
    setIsModalOpen(true);
  };

  const onSubmit = async (data: HobbyFormData) => {
    const hobbyData = {
      title: data.title,
      description: data.description,
      images: uploadedImages,
      date: data.date || null,
    };

    try {
      if (editingHobby) {
        await updateHobby.mutateAsync({
          id: editingHobby.id,
          updates: hobbyData,
        });
      } else {
        await createHobby.mutateAsync(hobbyData);
      }
      setIsModalOpen(false);
      reset();
      setUploadedImages([]);
    } catch (error) {
      console.error("Error saving hobby:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this hobby?")) {
      try {
        await deleteHobby.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting hobby:", error);
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
      <SEO title="Manage Hobbies" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Hobbies
            </h1>
            <Button onClick={openCreateModal}>Add New Hobby</Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hobbies?.map((hobby) => (
                <Card key={hobby.id} className="p-6">
                  {hobby.images[0] && (
                    <img
                      src={hobby.images[0]}
                      alt={hobby.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {hobby.title}
                  </h3>
                  {hobby.date && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {formatDate(hobby.date)}
                    </p>
                  )}
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {hobby.description}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => openEditModal(hobby)}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(hobby.id)}
                      className="flex-1"
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {hobbies && hobbies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No hobbies yet. Add your first hobby!
              </p>
              <Button onClick={openCreateModal}>Add New Hobby</Button>
            </div>
          )}
        </main>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingHobby ? "Edit Hobby" : "Add New Hobby"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            {...register("title")}
            label="Title"
            error={errors.title?.message}
            placeholder="Photography"
          />

          <Textarea
            {...register("description")}
            label="Description"
            error={errors.description?.message}
            placeholder="Describe your hobby..."
            rows={4}
          />

          <Input
            {...register("date")}
            type="date"
            label="Date"
            error={errors.date?.message}
          />

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Images
            </label>
            <ImageUpload
              bucket="hobby-images"
              path="hobbies"
              onUploadComplete={handleImageUpload}
            />
            {uploadedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {uploadedImages.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Hobby ${index + 1}`}
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
              {editingHobby ? "Update" : "Create"} Hobby
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
