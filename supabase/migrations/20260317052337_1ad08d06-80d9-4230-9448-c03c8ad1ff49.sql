
-- Function for admins to search users by email
CREATE OR REPLACE FUNCTION public.admin_search_users(search_term text)
RETURNS TABLE(user_id uuid, email text, created_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT au.id as user_id, au.email::text, au.created_at
  FROM auth.users au
  WHERE public.has_role(auth.uid(), 'admin')
    AND au.email ILIKE '%' || search_term || '%'
  ORDER BY au.created_at DESC
  LIMIT 20;
$$;

-- Function to get user balance (completed topups - completed orders)
CREATE OR REPLACE FUNCTION public.get_user_balance(uid uuid)
RETURNS numeric
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT SUM(amount) FROM public.topups WHERE user_id = uid AND status = 'completed'), 0
  ) - COALESCE(
    (SELECT SUM(amount) FROM public.orders WHERE user_id = uid AND status IN ('confirmed', 'completed')), 0
  );
$$;
