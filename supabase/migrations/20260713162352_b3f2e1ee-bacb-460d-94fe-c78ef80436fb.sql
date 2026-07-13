-- Grant EXECUTE on has_role so RLS policies can evaluate it for both anon and authenticated users.
-- The function is SECURITY DEFINER and only reads user_roles, so granting EXECUTE is safe;
-- it does NOT expose user_roles to the API (that table has its own RLS).
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO anon, authenticated, service_role;