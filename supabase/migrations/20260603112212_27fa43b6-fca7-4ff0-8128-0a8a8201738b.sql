DROP POLICY "Users can update own pending orders" ON public.orders;

CREATE POLICY "Users can update own pending orders"
ON public.orders
FOR UPDATE
TO authenticated
USING ((auth.uid() = user_id) AND (status = 'pending'::text))
WITH CHECK (
  (auth.uid() = user_id)
  AND (status = 'pending'::text)
  AND (amount = (SELECT o.amount FROM public.orders o WHERE o.id = orders.id))
  AND (product_id = (SELECT o.product_id FROM public.orders o WHERE o.id = orders.id))
);