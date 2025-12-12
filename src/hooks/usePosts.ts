import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Post } from "@/types";

export const usePosts = (filters?: {
  tags?: string[];
  search?: string;
  status?: "published" | "draft";
}) => {
  return useQuery({
    queryKey: ["posts", filters],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select("*")
        .order("publish_date", { ascending: false });

      if (filters?.status) {
        query = query.eq("status", filters.status);
      } else {
        // Default to only published posts for public view
        query = query.eq("status", "published");
      }

      if (filters?.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`
        );
      }

      if (filters?.tags && filters.tags.length > 0) {
        query = query.contains("tags", filters.tags);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Post[];
    },
  });
};

export const usePost = (slug: string) => {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as Post;
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      post: Omit<Post, "id" | "created_at" | "updated_at">
    ) => {
      const { data, error } = await supabase
        .from("posts")
        .insert(post as any)
        .select()
        .single();

      if (error) throw error;
      return data as Post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Post>;
    }) => {
      const { data, error } = await supabase
        .from("posts")
        .update({ ...updates, updated_at: new Date().toISOString() } as any)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
