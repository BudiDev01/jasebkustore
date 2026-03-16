import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const email = "admin@vip.jasebku.local";
  const password = "Owner";

  // Check if user already exists
  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === email);

  let userId: string;

  if (existing) {
    userId = existing.id;
    // Update password
    await supabaseAdmin.auth.admin.updateUserById(userId, { password });
  } else {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    userId = data.user.id;
  }

  // Ensure admin role
  const { data: roles } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "admin");

  if (!roles || roles.length === 0) {
    await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: "admin" });
  }

  return new Response(JSON.stringify({ success: true, userId }), {
    headers: { "Content-Type": "application/json" },
  });
});
