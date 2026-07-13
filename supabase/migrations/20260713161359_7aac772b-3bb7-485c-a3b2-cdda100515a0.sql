
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO postgres, service_role;

DROP FUNCTION IF EXISTS public.has_role(text);

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO postgres, service_role;

-- Drop ALL policies referencing public.has_role first
DROP POLICY IF EXISTS "site_content admin write" ON public.site_content;
DROP POLICY IF EXISTS "events public read" ON public.events;
DROP POLICY IF EXISTS "events admin write" ON public.events;
DROP POLICY IF EXISTS "gallery public read" ON public.gallery_images;
DROP POLICY IF EXISTS "gallery admin write" ON public.gallery_images;
DROP POLICY IF EXISTS "faculty public read" ON public.faculty;
DROP POLICY IF EXISTS "faculty admin write" ON public.faculty;
DROP POLICY IF EXISTS "council public read" ON public.student_council;
DROP POLICY IF EXISTS "council admin write" ON public.student_council;
DROP POLICY IF EXISTS "ach public read" ON public.achievements;
DROP POLICY IF EXISTS "ach admin write" ON public.achievements;
DROP POLICY IF EXISTS "plc public read" ON public.placements;
DROP POLICY IF EXISTS "plc admin write" ON public.placements;
DROP POLICY IF EXISTS "rsr public read" ON public.research;
DROP POLICY IF EXISTS "rsr admin write" ON public.research;
DROP POLICY IF EXISTS "news public read" ON public.news;
DROP POLICY IF EXISTS "news admin write" ON public.news;
DROP POLICY IF EXISTS "not public read" ON public.notices;
DROP POLICY IF EXISTS "not admin write" ON public.notices;
DROP POLICY IF EXISTS "dl public read" ON public.downloads;
DROP POLICY IF EXISTS "dl admin write" ON public.downloads;
DROP POLICY IF EXISTS "Public read images" ON storage.objects;
DROP POLICY IF EXISTS "Public read documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins update images" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete images" ON storage.objects;

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

CREATE POLICY "site_content admin write" ON public.site_content FOR ALL USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE POLICY "events public read" ON public.events FOR SELECT USING (is_visible OR private.has_role(auth.uid(),'admin'));
CREATE POLICY "events admin write" ON public.events FOR ALL USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE POLICY "gallery public read" ON public.gallery_images FOR SELECT USING (is_visible OR private.has_role(auth.uid(),'admin'));
CREATE POLICY "gallery admin write" ON public.gallery_images FOR ALL USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE POLICY "faculty admin all" ON public.faculty FOR ALL USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE POLICY "council public read" ON public.student_council FOR SELECT USING (is_visible OR private.has_role(auth.uid(),'admin'));
CREATE POLICY "council admin write" ON public.student_council FOR ALL USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE POLICY "ach public read" ON public.achievements FOR SELECT USING (is_visible OR private.has_role(auth.uid(),'admin'));
CREATE POLICY "ach admin write" ON public.achievements FOR ALL USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE POLICY "plc public read" ON public.placements FOR SELECT USING (is_visible OR private.has_role(auth.uid(),'admin'));
CREATE POLICY "plc admin write" ON public.placements FOR ALL USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE POLICY "rsr public read" ON public.research FOR SELECT USING (is_visible OR private.has_role(auth.uid(),'admin'));
CREATE POLICY "rsr admin write" ON public.research FOR ALL USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE POLICY "news public read" ON public.news FOR SELECT USING (is_visible OR private.has_role(auth.uid(),'admin'));
CREATE POLICY "news admin write" ON public.news FOR ALL USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE POLICY "not public read" ON public.notices FOR SELECT USING (is_visible OR private.has_role(auth.uid(),'admin'));
CREATE POLICY "not admin write" ON public.notices FOR ALL USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE POLICY "dl public read" ON public.downloads FOR SELECT USING (is_visible OR private.has_role(auth.uid(),'admin'));
CREATE POLICY "dl admin write" ON public.downloads FOR ALL USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins upload images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images' AND private.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins upload documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents' AND private.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update storage" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('images','documents') AND private.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete storage" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('images','documents') AND private.has_role(auth.uid(),'admin'));

ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

DROP POLICY IF EXISTS "profiles self update" ON public.profiles;
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE OR REPLACE VIEW public.faculty_public
WITH (security_invoker = off) AS
SELECT id, name, designation, qualification, research_area, photo_url, sort_order, is_visible
FROM public.faculty
WHERE is_visible = true;
REVOKE ALL ON public.faculty_public FROM PUBLIC;
GRANT SELECT ON public.faculty_public TO anon, authenticated;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
