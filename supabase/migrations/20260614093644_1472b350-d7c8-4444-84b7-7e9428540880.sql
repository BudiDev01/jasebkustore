
-- Enable RLS on realtime.messages (channel authorization)
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can subscribe to own message channel" ON realtime.messages;
CREATE POLICY "Users can subscribe to own message channel"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() = 'messages:' || auth.uid()::text
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);
