DROP POLICY IF EXISTS "Users can update own pending topups" ON public.topups;
CREATE POLICY "Users can update own pending topups" ON public.topups
FOR UPDATE TO authenticated
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (
  auth.uid() = user_id
  AND status = 'pending'
  AND amount = (SELECT t.amount FROM public.topups t WHERE t.id = topups.id)
);