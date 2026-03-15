import React, { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface AvatarUploadProps {
  currentUrl: string | null;
  fallback: string;
  size?: string;
  onUploaded?: (url: string) => void;
}

const AvatarUpload = ({ currentUrl, fallback, size = "w-20 h-20", onUploaded }: AvatarUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please select an image file", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "Max file size is 5MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      setPreview(null);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    const avatarUrl = `${publicUrl}?t=${Date.now()}`;

    await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("user_id", user.id);

    toast({ title: "Photo updated!" });
    setUploading(false);
    onUploaded?.(avatarUrl);
  };

  const displayUrl = preview || currentUrl;

  return (
    <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
      <Avatar className={`${size} border-2 border-gold/30`}>
        {displayUrl ? (
          <AvatarImage src={displayUrl} alt="Profile" />
        ) : null}
        <AvatarFallback className="gradient-gold text-primary-foreground text-lg font-bold">
          {fallback}
        </AvatarFallback>
      </Avatar>
      <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        {uploading ? (
          <Loader2 className="w-5 h-5 text-white animate-spin" />
        ) : (
          <Camera className="w-5 h-5 text-white" />
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AvatarUpload;
