import React, { useState } from "react";
import { Search, Loader2, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  user_id: string;
  email: string;
  created_at: string;
}

interface UserSearchProps {
  lang: "en" | "id";
}

const labels = {
  en: {
    searchPlaceholder: "Search by email...",
    search: "Search",
    noResults: "No users found.",
    email: "Email",
    registered: "Registered",
  },
  id: {
    searchPlaceholder: "Cari berdasarkan email...",
    search: "Cari",
    noResults: "Pengguna tidak ditemukan.",
    email: "Email",
    registered: "Terdaftar",
  },
};

const UserSearch = ({ lang }: UserSearchProps) => {
  const t = labels[lang];
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    const { data, error } = await supabase.rpc("admin_search_users", { search_term: query.trim() });
    setResults(error ? [] : (data as SearchResult[]) ?? []);
    setLoading(false);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder={t.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
        />
        <Button onClick={handleSearch} disabled={loading} className="gradient-gold text-primary-foreground shrink-0">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span className="ml-1">{t.search}</span>
        </Button>
      </div>

      {searched && !loading && results.length === 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-8 text-center">
            <Users className="w-10 h-10 text-white/20 mx-auto mb-2" />
            <p className="text-white/40 text-sm">{t.noResults}</p>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((u) => (
            <Card key={u.user_id} className="bg-white/5 border-white/10">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm">{u.email}</p>
                  <p className="text-white/40 text-xs">
                    {t.registered}: {formatDate(u.created_at)}
                  </p>
                </div>
                <p className="text-white/20 text-xs font-mono">{u.user_id.slice(0, 8)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
