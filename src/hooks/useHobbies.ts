import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Hobby } from "@/types";

export const useHobbies = () => {
  return useQuery({
    queryKey: ["hobbies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hobbies")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return data as Hobby[];
    },
  });
};

export const useHobby = (id: string) => {
  return useQuery({
    queryKey: ["hobby", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hobbies")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Hobby;
    },
  });
};

export const useCreateHobby = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      hobby: Omit<Hobby, "id" | "created_at" | "updated_at">
    ) => {
      const { data, error } = await supabase
        .from("hobbies")
        .insert(hobby as any)
        .select()
        .single();

      if (error) throw error;
      return data as Hobby;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hobbies"] });
    },
  });
};

export const useUpdateHobby = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Hobby>;
    }) => {
      const { data, error } = await supabase
        .from("hobbies")
        .update({ ...updates, updated_at: new Date().toISOString() } as any)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Hobby;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hobbies"] });
    },
  });
};

export const useDeleteHobby = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("hobbies").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hobbies"] });
    },
  });
};
