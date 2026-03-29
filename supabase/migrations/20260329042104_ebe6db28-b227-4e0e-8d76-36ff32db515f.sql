CREATE OR REPLACE FUNCTION public.admin_search_users(search_term text)
 RETURNS TABLE(user_id uuid, email text, created_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT au.id as user_id, au.email::text, au.created_at
  FROM auth.users au
  WHERE public.has_role(auth.uid(), 'admin')
    AND au.email ILIKE '%' || search_term || '%'
  ORDER BY au.created_at DESC
  LIMIT 200;
$function$