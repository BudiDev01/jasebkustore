import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Profile {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) { setProfile(null); setLoading(false); return; }
    const { data } = await supabase
      .from("profiles")
      .select("username, full_name, avatar_url")
      .eq("user_id", user.id)
      .maybeSingle();
    setProfile(data);
    setLoading(false);
  };

  useEffect(() => { fetchProfile(); }, [user]);

  const refresh = () => fetchProfile();

  return { profile, loading, refresh };
};
