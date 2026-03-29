import React, { useEffect, useState, useRef } from "react";
import { Send, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Lang = "en" | "id";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string | null;
  message: string;
  is_admin: boolean;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  user_id: string;
  email: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
}

const labels: Record<Lang, Record<string, string>> = {
  en: {
    title: "Customer Chat",
    noConversations: "No conversations yet.",
    typeReply: "Type reply...",
    back: "← Back to list",
  },
  id: {
    title: "Chat Pelanggan",
    noConversations: "Belum ada percakapan.",
    typeReply: "Ketik balasan...",
    back: "← Kembali ke daftar",
  },
};

const AdminChat = ({ lang }: { lang: Lang }) => {
  const { user } = useAuth();
  const t = labels[lang];
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [emailMap, setEmailMap] = useState<Record<string, string>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load all messages and group by user
  const loadConversations = async () => {
    const { data: allMessages } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: users } = await supabase.rpc("admin_search_users", { search_term: "" });
    const map: Record<string, string> = {};
    (users as { user_id: string; email: string }[] ?? []).forEach((u) => { map[u.user_id] = u.email; });
    setEmailMap(map);

    if (!allMessages) return;

    // Group by non-admin sender
    const grouped: Record<string, Message[]> = {};
    for (const m of allMessages as Message[]) {
      const custId = m.is_admin ? m.receiver_id : m.sender_id;
      if (!custId || custId === user?.id) continue;
      if (!grouped[custId]) grouped[custId] = [];
      grouped[custId].push(m);
    }

    const convs: Conversation[] = Object.entries(grouped).map(([uid, msgs]) => ({
      user_id: uid,
      email: map[uid] || uid.slice(0, 12) + "…",
      lastMessage: msgs[0].message,
      lastTime: msgs[0].created_at,
      unread: msgs.filter((m) => !m.is_admin && !m.is_read).length,
    }));

    convs.sort((a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime());
    setConversations(convs);
  };

  const loadMessages = async (userId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: true });
    setMessages((data as Message[]) ?? []);

    // Mark as read
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("sender_id", userId)
      .eq("is_admin", false)
      .eq("is_read", false);
  };

  useEffect(() => {
    loadConversations();

    const channel = supabase
      .channel("admin-messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        if (selectedUserId) loadMessages(selectedUserId);
        loadConversations();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadMessages(selectedUserId);
    }
  }, [selectedUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !user || !selectedUserId) return;
    setSending(true);
    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: selectedUserId,
      message: text.trim(),
      is_admin: true,
    });
    setText("");
    setSending(false);
  };

  // Conversation list view
  if (!selectedUserId) {
    return (
      <div className="space-y-3">
        {conversations.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-12 text-center">
              <MessageCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40">{t.noConversations}</p>
            </CardContent>
          </Card>
        ) : (
          conversations.map((c) => (
            <Card
              key={c.user_id}
              className="bg-white/5 border-white/10 cursor-pointer hover:border-gold/40 transition-colors"
              onClick={() => setSelectedUserId(c.user_id)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-gold font-medium text-sm truncate">{c.email}</p>
                    {c.unread > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                        {c.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-white/40 text-xs truncate">{c.lastMessage}</p>
                </div>
                <p className="text-white/30 text-[10px] shrink-0">
                  {new Date(c.lastTime).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  }

  // Chat detail view
  return (
    <div className="flex flex-col h-[32rem]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <button onClick={() => setSelectedUserId(null)} className="text-gold text-sm hover:underline">
          {t.back}
        </button>
        <span className="text-white/60 text-sm">|</span>
        <span className="text-gold font-medium text-sm">{emailMap[selectedUserId] || selectedUserId.slice(0, 12)}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.is_admin ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                m.is_admin
                  ? "bg-gold text-primary-foreground rounded-br-none"
                  : "bg-white/10 text-white rounded-bl-none"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{m.message}</p>
              <p className={`text-[10px] mt-1 ${m.is_admin ? "text-primary-foreground/70" : "text-white/40"}`}>
                {new Date(m.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder={t.typeReply}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-gold/40"
        />
        <Button size="sm" onClick={handleSend} disabled={sending || !text.trim()} className="bg-gold text-primary-foreground hover:opacity-90 h-9 w-9 p-0">
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

export default AdminChat;
