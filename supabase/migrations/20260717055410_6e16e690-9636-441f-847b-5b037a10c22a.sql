-- Remove broad SELECT policies on storage.objects. Public buckets still serve
-- individual files via /object/public/* without RLS, but listing is now blocked.
DROP POLICY IF EXISTS "Public read images" ON storage.objects;
DROP POLICY IF EXISTS "Public read documents" ON storage.objects;