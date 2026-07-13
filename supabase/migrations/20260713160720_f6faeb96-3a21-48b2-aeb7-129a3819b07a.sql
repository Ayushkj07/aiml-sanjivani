
CREATE POLICY "Public read images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Public read documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "Admins upload images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins upload documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('images','documents') AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('images','documents') AND public.has_role(auth.uid(), 'admin'));
