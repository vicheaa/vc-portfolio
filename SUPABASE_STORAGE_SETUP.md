# Supabase Storage Setup Guide

## Step 1: Create Storage Buckets

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"** and create these buckets:

### Bucket 1: project-images

- Name: `project-images`
- Public bucket: ✅ **YES** (check this box)
- Click "Create bucket"

### Bucket 2: blog-images

- Name: `blog-images`
- Public bucket: ✅ **YES** (check this box)
- Click "Create bucket"

### Bucket 3: hobby-images

- Name: `hobby-images`
- Public bucket: ✅ **YES** (check this box)
- Click "Create bucket"

### Bucket 4: general

- Name: `general`
- Public bucket: ✅ **YES** (check this box)
- Click "Create bucket"

## Step 2: Set Bucket Policies (If Upload Still Fails)

For each bucket, you may need to set policies:

1. Click on the bucket name
2. Click **"Policies"** tab
3. Click **"New Policy"**
4. Use the following policy:

### Policy for INSERT (Upload)

```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images');
```

Change `'project-images'` to the appropriate bucket name for each bucket.

### Policy for SELECT (Read)

```sql
-- Allow public to read
CREATE POLICY "Allow public to read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'project-images');
```

### Quick Policy Template for All Buckets

Run this in your Supabase SQL Editor:

```sql
-- Policies for project-images
CREATE POLICY "Allow authenticated users to upload to project-images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Allow public to read project-images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'project-images');

-- Policies for blog-images
CREATE POLICY "Allow authenticated users to upload to blog-images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Allow public to read blog-images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'blog-images');

-- Policies for hobby-images
CREATE POLICY "Allow authenticated users to upload to hobby-images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'hobby-images');

CREATE POLICY "Allow public to read hobby-images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'hobby-images');

-- Policies for general
CREATE POLICY "Allow authenticated users to upload to general"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'general');

CREATE POLICY "Allow public to read general"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'general');
```

## Step 3: Verify Environment Variables

Make sure your `.env` file has the correct values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Test Upload

1. Restart your development server: `npm run dev`
2. Login to admin dashboard: `/admin/login`
3. Try uploading an image in Projects, Posts, or Hobbies

## Troubleshooting

### Error: "new row violates row-level security policy"

- Make sure you're logged in as an authenticated user
- Check that the bucket policies allow INSERT for authenticated users

### Error: "Bucket not found"

- Verify the bucket name is exactly: `project-images`, `blog-images`, `hobby-images`, or `general`
- Check for typos in bucket names

### Error: "Object name already exists"

- This shouldn't happen with the new unique filename generation
- If it does, try uploading again

### Images upload but show broken/404

- Make sure buckets are set to **Public**
- Check the public URL in browser console logs
- Verify bucket policies allow SELECT for public

### Check Browser Console

Open browser DevTools (F12) and check the Console tab for detailed error messages. The upload function now logs:

- Upload attempt details (bucket, path, file info)
- Supabase errors
- Generated public URLs

## Quick Checklist

- [ ] All 4 buckets created
- [ ] All buckets set to **Public**
- [ ] Storage policies applied (if needed)
- [ ] Environment variables correct
- [ ] Development server restarted
- [ ] Logged in as admin user
- [ ] Browser console checked for errors
