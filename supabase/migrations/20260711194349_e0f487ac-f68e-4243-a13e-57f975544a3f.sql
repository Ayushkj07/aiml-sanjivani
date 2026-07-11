
-- Bootstrap admin user
DO $$
DECLARE
  v_admin_id uuid;
  v_existing uuid;
BEGIN
  SELECT id INTO v_existing FROM auth.users WHERE email = 'admin@aimldept.edu';
  IF v_existing IS NULL THEN
    v_admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token,
      raw_app_meta_data, raw_user_meta_data
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_admin_id, 'authenticated', 'authenticated',
      'admin@aimldept.edu',
      crypt('AIML@Admin2026!', gen_salt('bf')),
      now(), now(), now(),
      '', '', '', '',
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"AIML Admin"}'::jsonb
    );
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_admin_id, v_admin_id::text, jsonb_build_object('sub', v_admin_id::text, 'email', 'admin@aimldept.edu'), 'email', now(), now(), now());
  ELSE
    v_admin_id := v_existing;
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (v_admin_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;

-- Seed default site content blocks
INSERT INTO public.site_content (key, value) VALUES
('home_hero', '{"title":"Department of Artificial Intelligence & Machine Learning","subtitle":"Empowering innovation through intelligent systems","cta_text":"Explore Department","cta_link":"/about","background_image":""}'::jsonb),
('about', '{"title":"About the Department","body":"The Department of Artificial Intelligence and Machine Learning is committed to academic excellence, cutting-edge research, and industry-ready education in AI, ML, Data Science, and emerging computational technologies.","image":""}'::jsonb),
('vision', '{"title":"Our Vision","body":"To be a center of excellence in AI & ML education and research, producing globally competent professionals who drive technological innovation for societal benefit."}'::jsonb),
('mission', '{"title":"Our Mission","items":["Deliver quality education in AI, ML, and Data Science.","Foster research and innovation in emerging computational fields.","Develop industry-ready graduates through practical, project-based learning.","Promote ethical and responsible AI practices."]}'::jsonb),
('hod', '{"name":"Dr. HOD Name","designation":"Head of Department, AI & ML","message":"Welcome to the Department of AI & ML. Our department is committed to nurturing the next generation of AI professionals and researchers.","photo_url":"","qualification":"Ph.D. in Computer Science","email":"hod.aiml@example.edu"}'::jsonb),
('contact', '{"address":"AI & ML Department, College Campus","email":"aiml@example.edu","phone":"+91-0000000000","map_embed":""}'::jsonb),
('footer', '{"description":"Department of Artificial Intelligence & Machine Learning","copyright":"© 2026 AI & ML Department. All rights reserved."}'::jsonb),
('social', '{"facebook":"","twitter":"","instagram":"","linkedin":"","youtube":""}'::jsonb)
ON CONFLICT (key) DO NOTHING;
