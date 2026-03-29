import React, { useEffect, useState, useRef } from "react";
import { Send, Loader2, MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string | null;
  message: string;
  is_admin: boolean;
  is_read: boolean;
  created_at: string;
}

const UserInbox = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessageThread, setSelectedMessageThread] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadInbox = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    const allMsgs = (data as Message[]) ?? [];
    
    // Get unique conversations (group by the latest message)
    const seen = new Set<string>();
    const inbox: Message[] = [];
    for (const m of allMsgs) {
      const key = m.is_admin ? `admin-${m.sender_id}` : "my-messages";
      if (!seen.has(key)) {
        seen.add(key);
        inbox.push(m);
      }
    }

    setMessages(allMsgs);
    setUnreadCount(allMsgs.filter(m => m.is_admin && !m.is_read && m.receiver_id === user.id).length);
    setLoading(false);
  };

  const loadThread = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: true });

    setThreadMessages((data as Message[]) ?? []);

    // Mark admin messages as read
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("receiver_id", user.id)
      .eq("is_admin", true)
      .eq("is_read", false);
    
    setUnreadCount(0);
  };

  useEffect(() => {
    loadInbox();

    const channel = supabase
      .channel("user-inbox")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        loadInbox();
        if (selectedMessageThread) loadThread();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    if (selectedMessageThread) {
      loadThread();
    }
  }, [selectedMessageThread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages]);

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

  // Thread view
  if (selectedMessageThread) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden flex flex-col h-[28rem]">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
          <button onClick={() => setSelectedMessageThread(null)} className="text-gold hover:opacity-80">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <MessageCircle className="w-4 h-4 text-gold" />
          <span className="font-semibold text-sm text-foreground">Pesan dengan Admin</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {threadMessages.map((m) => (
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
    );
  }

  // Inbox list view
  const adminReplies = messages.filter(m => m.is_admin && m.receiver_id === user.id);
  const myMessages = messages.filter(m => !m.is_admin && m.sender_id === user.id);
  const hasConversation = adminReplies.length > 0 || myMessages.length > 0;

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading...</div>
      ) : !hasConversation ? (
        <div className="p-12 text-center">
          <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Belum ada pesan.</p>
          <p className="text-muted-foreground text-xs mt-1">Kirim pesan melalui Online Chat di halaman utama.</p>
        </div>
      ) : (
        <div
          className="p-4 flex items-center gap-3 hover:bg-muted/30 transition-colors cursor-pointer"
          onClick={() => setSelectedMessageThread("admin")}
        >
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm text-foreground">Admin</p>
              {unreadCount > 0 && (
                <span className="bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-xs truncate">
              {(adminReplies[0] || myMessages[0])?.message}
            </p>
          </div>
          <p className="text-muted-foreground text-[10px] shrink-0">
            {new Date((adminReplies[0] || myMessages[0])?.created_at).toLocaleString("id-ID", {
              day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserInbox;
