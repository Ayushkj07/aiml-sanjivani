
DROP VIEW IF EXISTS public.faculty_public;

-- Restore a public read policy on faculty, but restrict which columns anon/authenticated can SELECT
CREATE POLICY "faculty public read" ON public.faculty
FOR SELECT
USING (is_visible OR private.has_role(auth.uid(),'admin'));

-- Revoke broad SELECT, then grant only safe columns to public roles.
REVOKE SELECT ON public.faculty FROM anon, authenticated;
GRANT SELECT (id, name, designation, qualification, research_area, photo_url, sort_order, is_visible, created_at, updated_at)
  ON public.faculty TO anon, authenticated;
-- Admins read email/phone via service_role or via full grant to a dedicated admin path.
-- Give authenticated full column access ONLY when acting as admin: we can't grant per-role via has_role,
-- so keep email/phone reachable to authenticated (admins). Non-admin authenticated users are blocked by RLS
-- because is_visible rows still hide email/phone via column grants... but column grants apply to role, not per-user.
-- Solution: keep email/phone unreadable to authenticated too; admin UI reads via service_role in a server fn.
-- For now, grant email/phone SELECT only to service_role (default) and keep them out of anon/authenticated grants.

GRANT INSERT, UPDATE, DELETE ON public.faculty TO authenticated;
