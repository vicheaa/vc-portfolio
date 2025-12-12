# Personal Portfolio Website

A production-ready personal portfolio website with a full-featured CMS backend built with React 19, TypeScript, Tailwind CSS, React Query (TanStack Query v5), and Supabase.

## Features

### Public Pages

- **Home**: Hero section with featured projects, blog posts, and hobbies
- **Projects**: Searchable and filterable grid of projects with detail pages
- **Blog**: Blog posts with markdown support, tags, and filtering
- **Hobbies**: Personal interests showcase
- **About**: Bio, skills grid, resume download, and contact form

### Admin Dashboard

- **Authentication**: Supabase Auth for secure login
- **Projects Management**: CRUD operations for projects
- **Blog Management**: CRUD operations with draft/published status
- **Hobbies Management**: CRUD operations for hobbies
- **Image Upload**: Supabase Storage integration

### Technical Features

- **React Query**: Optimistic updates and caching
- **Dark Mode**: Toggle with localStorage persistence
- **Responsive Design**: Mobile-first approach
- **PWA Support**: Installable web app
- **SEO Optimized**: Dynamic meta tags with react-helmet-async
- **Animations**: Smooth micro-animations with Framer Motion
- **Forms**: React Hook Form + Zod validation
- **TypeScript**: Strict mode for type safety

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Tailwind Typography
- **State Management**: TanStack Query v5
- **Backend**: Supabase (Postgres, Auth, Storage)
- **Animations**: Framer Motion
- **Forms**: React Hook Form, Zod
- **Routing**: React Router v6

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- Git

## Local Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from Settings > API

### 4. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Set Up Database

Run the following SQL in your Supabase SQL Editor:

```sql
-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  start_date DATE,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  publish_date TIMESTAMPTZ,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hobbies table
CREATE TABLE hobbies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hobbies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Projects
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON projects FOR DELETE USING (auth.role() = 'authenticated');

-- RLS Policies for Posts
CREATE POLICY "Public can read published posts" ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "Authenticated users can read all" ON posts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert" ON posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON posts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON posts FOR DELETE USING (auth.role() = 'authenticated');

-- RLS Policies for Hobbies
CREATE POLICY "Public read access" ON hobbies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert" ON hobbies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON hobbies FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON hobbies FOR DELETE USING (auth.role() = 'authenticated');
```

### 6. Create Storage Buckets

In Supabase Storage, create the following buckets (make them public):

- `project-images`
- `blog-images`
- `hobby-images`
- `general` (for resume PDF, etc.)

### 7. Create Admin User

In Supabase Authentication > Users, create a new user for admin access.

### 8. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment to Vercel

### Option 1: Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

### Option 2: Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

## Project Structure

```
portfolio/
├── src/
│   ├── components/      # Reusable components
│   │   ├── layout/      # Header, Footer
│   │   ├── ui/          # Button, Card, Input, etc.
│   │   ├── shared/      # ErrorBoundary, SEO, etc.
│   │   └── features/    # Feature-specific components
│   ├── pages/           # Page components
│   │   ├── admin/       # Admin dashboard pages
│   │   └── ...          # Public pages
│   ├── hooks/           # Custom React Query hooks
│   ├── context/         # React contexts (Auth, Theme)
│   ├── lib/             # Utility libraries
│   └── types/           # TypeScript types
├── public/              # Static assets
└── ...config files
```

## Usage

### Admin Dashboard

1. Navigate to `/admin/login`
2. Sign in with your Supabase user credentials
3. Access dashboard at `/admin`
4. Manage projects, posts, and hobbies

### Content Management

- **Projects**: Add technical projects with images, tags, and links
- **Blog**: Write blog posts in markdown with featured images
- **Hobbies**: Showcase personal interests

## Customization

1. **Personal Information**: Update hero section in `src/pages/Home.tsx`
2. **Colors**: Modify Tailwind config in `tailwind.config.js`
3. **Footer Links**: Update social links in `src/components/layout/Footer.tsx`

## Known Issues

- Tailwind CSS v4 compatibility: The project may require downgrading to Tailwind CSS v3 for PostCSS compatibility. Run: `npm install tailwindcss@3 --save-dev`

## Contributing

This is a personal portfolio template. Feel free to fork and customize for your own use!

## License

MIT License - feel free to use this template for your own portfolio.

## Support

For issues or questions, please open an issue on GitHub.

## Acknowledgments

- Built with ❤️ using React, TypeScript, and Supabase
- Icons from Heroicons
- Fonts from Google Fonts
