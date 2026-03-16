CREATE TABLE public.topups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  method text NOT NULL DEFAULT 'qris',
  status text NOT NULL DEFAULT 'pending',
  notes text,
  payment_proof_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.topups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own topups" ON public.topups
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own topups" ON public.topups
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own topups" ON public.topups
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all topups" ON public.topups
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_topups_updated_at
  BEFORE UPDATE ON public.topups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();