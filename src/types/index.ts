// Database types
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  tags: string[];
  images: string[];
  live_url: string | null;
  github_url: string | null;
  start_date: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  tags: string[];
  featured_image: string | null;
  publish_date: string | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface Hobby {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  date: string | null;
  created_at: string;
  updated_at: string;
}

// Form types
export interface ProjectFormData {
  title: string;
  description: string;
  tags: string[];
  images: string[];
  live_url: string;
  github_url: string;
  start_date: string;
  featured: boolean;
}

export interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  featured_image: string;
  publish_date: string;
  status: "draft" | "published";
}

export interface HobbyFormData {
  title: string;
  description: string;
  images: string[];
  date: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Auth types
export interface User {
  id: string;
  email: string;
}

// Supabase Database types
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Project, "id" | "created_at" | "updated_at">>;
      };
      posts: {
        Row: Post;
        Insert: Omit<Post, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Post, "id" | "created_at" | "updated_at">>;
      };
      hobbies: {
        Row: Hobby;
        Insert: Omit<Hobby, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Hobby, "id" | "created_at" | "updated_at">>;
      };
    };
  };
}
