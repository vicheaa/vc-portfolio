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
  usePosts,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
} from "@/hooks/usePosts";
import { generateSlug } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z
    .string()
    .max(200, "Excerpt must be less than 200 characters")
    .optional(),
  tags: z.string(),
  publish_date: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

type PostFormData = z.infer<typeof postSchema>;

export const PostsManager: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [featuredImage, setFeaturedImage] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState("");

  const { data: posts, isLoading } = usePosts({ status: undefined });
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      tags: "",
      publish_date: "",
      status: "draft",
    },
  });

  const content = watch("content");

  const openCreateModal = () => {
    setEditingPost(null);
    setFeaturedImage("");
    reset();
    setIsModalOpen(true);
  };

  const openEditModal = (post: Post) => {
    setEditingPost(post);
    setFeaturedImage(post.featured_image || "");
    setValue("title", post.title);
    setValue("content", post.content);
    setValue("excerpt", post.excerpt || "");
    setValue("tags", post.tags.join(", "));
    setValue("publish_date", post.publish_date || "");
    setValue("status", post.status);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: PostFormData) => {
    const postData = {
      title: data.title,
      slug: editingPost?.slug || generateSlug(data.title),
      content: data.content,
      excerpt: data.excerpt || null,
      tags: data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      featured_image: featuredImage || null,
      publish_date: data.publish_date || null,
      status: data.status,
    };

    try {
      if (editingPost) {
        await updatePost.mutateAsync({
          id: editingPost.id,
          updates: postData,
        });
      } else {
        await createPost.mutateAsync(postData);
      }
      setIsModalOpen(false);
      reset();
      setFeaturedImage("");
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deletePost.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  return (
    <>
      <SEO title="Manage Blog Posts" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Blog Posts
            </h1>
            <Button onClick={openCreateModal}>Add New Post</Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {posts?.map((post) => (
                <Card key={post.id} className="p-6">
                  <div className="flex gap-6">
                    {post.featured_image && (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-48 h-32 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {post.title}
                        </h3>
                        <Badge
                          variant={
                            post.status === "published" ? "success" : "warning"
                          }
                        >
                          {post.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {post.excerpt || post.content.substring(0, 150) + "..."}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                      </div>
                      {post.publish_date && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Published: {formatDate(post.publish_date)}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => openEditModal(post)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(post.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {posts && posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No blog posts yet. Write your first post!
              </p>
              <Button onClick={openCreateModal}>Add New Post</Button>
            </div>
          )}
        </main>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPost ? "Edit Post" : "Add New Post"}
        size="xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            {...register("title")}
            label="Title"
            error={errors.title?.message}
            placeholder="My Awesome Blog Post"
          />

          <Textarea
            {...register("excerpt")}
            label="Excerpt (optional)"
            error={errors.excerpt?.message}
            placeholder="A short summary of your post..."
            rows={2}
          />

          {/* Markdown Editor with Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Content (Markdown)
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowPreview(!showPreview);
                  setPreviewContent(content);
                }}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {showPreview ? "Edit" : "Preview"}
              </button>
            </div>

            {showPreview ? (
              <div className="prose prose-lg dark:prose-invert max-w-none p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 min-h-[300px]">
                {previewContent || "Nothing to preview yet..."}
              </div>
            ) : (
              <Textarea
                {...register("content")}
                error={errors.content?.message}
                placeholder="Write your post in markdown..."
                rows={12}
                className="font-mono text-sm"
              />
            )}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Use markdown syntax for formatting. Preview to see the result.
            </p>
          </div>

          <Input
            {...register("tags")}
            label="Tags (comma-separated)"
            error={errors.tags?.message}
            placeholder="React, TypeScript, Web Development"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register("publish_date")}
              type="date"
              label="Publish Date"
              error={errors.publish_date?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* Featured Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Featured Image
            </label>
            <ImageUpload
              bucket="blog-images"
              path="posts"
              onUploadComplete={setFeaturedImage}
              currentImage={featuredImage}
            />
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
              {editingPost ? "Update" : "Create"} Post
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
