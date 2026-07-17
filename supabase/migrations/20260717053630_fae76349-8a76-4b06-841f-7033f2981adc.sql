
-- 1. Restrict faculty email/phone from anonymous visitors via column-level grants
REVOKE SELECT ON public.faculty FROM anon;
GRANT SELECT (id, name, designation, qualification, research_area, photo_url, sort_order, is_visible, created_at, updated_at) ON public.faculty TO anon;

-- 2. Notices: default is_visible to false so drafts are not accidentally exposed
ALTER TABLE public.notices ALTER COLUMN is_visible SET DEFAULT false;

-- 3. Explicit public SELECT policies on storage.objects for the two public buckets
DROP POLICY IF EXISTS "Public read images" ON storage.objects;
CREATE POLICY "Public read images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Public read documents" ON storage.objects;
CREATE POLICY "Public read documents" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'documents');
