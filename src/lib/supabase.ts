import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper function to generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Helper function to upload image to Supabase Storage
export const uploadImage = async (
  file: File,
  bucket: string,
  path: string
): Promise<string> => {
  try {
    console.log("=== Starting Image Upload ===");
    console.log("Bucket:", bucket);
    console.log("Path:", path);
    console.log("File:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    console.log("Upload path:", filePath);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("=== Upload Error ===");
      console.error("Error details:", error);
      console.error("Error message:", error.message);
      console.error("Error status:", (error as any).statusCode);

      // Provide user-friendly error messages
      if (error.message.includes("row-level security")) {
        throw new Error(
          "Permission denied. Make sure you are logged in and storage policies are set up correctly."
        );
      } else if (error.message.includes("not found")) {
        throw new Error(
          `Bucket "${bucket}" not found. Please create it in Supabase Dashboard.`
        );
      } else if (error.message.includes("Already exists")) {
        throw new Error("File already exists. Please try again.");
      } else {
        throw new Error(`Upload failed: ${error.message}`);
      }
    }

    console.log("Upload successful:", data);

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error("Failed to get public URL");
    }

    console.log("Public URL:", urlData.publicUrl);
    console.log("=== Upload Complete ===");

    return urlData.publicUrl;
  } catch (error: any) {
    console.error("=== Upload Failed ===");
    console.error(error);
    throw error;
  }
};

// Helper function to delete image from Supabase Storage
export const deleteImage = async (
  url: string,
  bucket: string
): Promise<void> => {
  try {
    console.log("Deleting image:", url);
    const filePath = url.split(`${bucket}/`)[1];

    if (!filePath) {
      console.warn("Could not extract file path from URL");
      return;
    }

    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      throw error;
    }

    console.log("Image deleted successfully");
  } catch (error: any) {
    console.error("Failed to delete image:", error);
    // Don't throw on delete errors to avoid blocking other operations
  }
};
