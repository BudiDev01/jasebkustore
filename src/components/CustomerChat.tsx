import React, { useEffect, useState, useRef } from "react";
import { Send, MessageCircle, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  sender_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

const CustomerChat = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: true });
    setMessages((data as Message[]) ?? []);
    const unreadCount = (data ?? []).filter((m: any) => m.is_admin && !m.is_read && m.receiver_id === user.id).length;
    setUnread(unreadCount);
  };

  useEffect(() => {
    if (!user) return;
    loadMessages();

    const channel = supabase
      .channel("customer-messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        loadMessages();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      // Mark admin replies as read
      if (user) {
        supabase
          .from("messages")
          .update({ is_read: true })
          .eq("receiver_id", user.id)
          .eq("is_admin", true)
          .eq("is_read", false)
          .then(() => setUnread(0));
      }
    }
  }, [open, messages]);

  const handleSend = async () => {
    if (!text.trim() || !user) return;
    setSending(true);
    await supabase.from("messages").insert({
      sender_id: user.id,
      message: text.trim(),
      is_admin: false,
    });
    setText("");
    setSending(false);
  };

  if (!user) return null;

  return (
    <>
      {/* Chat toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-gold text-primary-foreground shadow-gold flex items-center justify-center hover:scale-105 transition-transform"
        >
          <MessageCircle className="w-6 h-6" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[28rem] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gold text-primary-foreground">
            <span className="font-bold text-sm flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Chat Admin
            </span>
            <button onClick={() => setOpen(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 && (
              <p className="text-muted-foreground text-xs text-center mt-8">Belum ada pesan. Kirim pesan ke admin!</p>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.is_admin ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                    m.is_admin
                      ? "bg-muted text-foreground rounded-bl-none"
                      : "bg-gold text-primary-foreground rounded-br-none"
                  }`}
                >
                  {m.is_admin && <p className="text-[10px] font-bold text-gold mb-0.5">Admin</p>}
                  <p className="whitespace-pre-wrap break-words">{m.message}</p>
                  <p className={`text-[10px] mt-1 ${m.is_admin ? "text-muted-foreground" : "text-primary-foreground/70"}`}>
                    {new Date(m.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-3 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Ketik pesan..."
              className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <Button size="sm" onClick={handleSend} disabled={sending || !text.trim()} className="bg-gold text-primary-foreground hover:opacity-90 h-9 w-9 p-0">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerChat;
