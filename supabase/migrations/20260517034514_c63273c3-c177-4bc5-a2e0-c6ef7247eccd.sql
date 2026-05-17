
-- Orders
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
CREATE POLICY "Users can update own pending orders" ON public.orders
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
    AND amount = (SELECT amount FROM public.orders o WHERE o.id = orders.id)
    AND product_id = (SELECT product_id FROM public.orders o WHERE o.id = orders.id)
  );

-- Topups
DROP POLICY IF EXISTS "Users can create own topups" ON public.topups;
CREATE POLICY "Users can create own topups" ON public.topups
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
    AND amount > 0
  );

DROP POLICY IF EXISTS "Users can update own topups" ON public.topups;
CREATE POLICY "Users can update own pending topups" ON public.topups
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
    AND amount = (SELECT amount FROM public.topups t WHERE t.id = topups.id)
  );

-- get_user_balance authorization
CREATE OR REPLACE FUNCTION public.get_user_balance(uid uuid)
RETURNS numeric
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL OR (auth.uid() <> uid AND NOT public.has_role(auth.uid(), 'admin')) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  RETURN COALESCE(
    (SELECT SUM(amount) FROM public.topups WHERE user_id = uid AND status = 'completed'), 0
  ) - COALESCE(
    (SELECT SUM(amount) FROM public.orders WHERE user_id = uid AND status IN ('confirmed', 'completed')), 0
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_user_balance(uuid) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_balance(uuid) TO authenticated;

-- user_roles: admin-only writes
CREATE POLICY "Only admins can insert roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
