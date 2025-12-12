import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Project } from "@/types";

export const useProjects = (filters?: {
  tags?: string[];
  search?: string;
  featured?: boolean;
}) => {
  return useQuery({
    queryKey: ["projects", filters],
    queryFn: async () => {
      let query = supabase
        .from("projects")
        .select("*")
        .order("start_date", { ascending: false });

      if (filters?.featured) {
        query = query.eq("featured", true);
      }

      if (filters?.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      if (filters?.tags && filters.tags.length > 0) {
        query = query.contains("tags", filters.tags);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Project[];
    },
  });
};

export const useProject = (slug: string) => {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as Project;
    },
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      project: Omit<Project, "id" | "created_at" | "updated_at">
    ) => {
      const { data, error } = await supabase
        .from("projects")
        .insert(project as any)
        .select()
        .single();

      if (error) throw error;
      return data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Project>;
    }) => {
      const { data, error } = await supabase
        .from("projects")
        .update({ ...updates, updated_at: new Date().toISOString() } as any)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
