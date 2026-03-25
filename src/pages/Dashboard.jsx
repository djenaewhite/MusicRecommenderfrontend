import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------
  // AUTOCOMPLETE
  // -----------------------------
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetch(`http://127.0.0.1:10000/search?q=${encodeURIComponent(search)}`)
        .then((res) => res.json())
        .then((data) => setResults(data || []))
        .catch((err) => console.error(err));
    }, 200);

    return () => clearTimeout(timeout);
  }, [search]);

  // -----------------------------
  // ADD SONG
  // -----------------------------
  const addSong = (song) => {
    if (!song) return;
    if (!songs.find((s) => s.id === song.id)) {
      setSongs([...songs, song]);
    }
    setSearch("");
    setResults([]);
  };

  // -----------------------------
  // REMOVE SONG
  // -----------------------------
  const removeSong = (id) => {
    setSongs(songs.filter((s) => s.id !== id));
  };

  // -----------------------------
  // GET RECOMMENDATIONS
  // -----------------------------
  const recommend = async () => {
    setLoading(true);
    setError("");

    try {
      const songNames = songs.map((s) => s.name);

      const res = await fetch("http://127.0.0.1:10000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songs: songNames }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }

    setLoading(false);
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="max-w-5xl mx-auto p-8">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-2">ML Music Recommender</h1>
      <p className="text-zinc-400 mb-6">
        Search songs and get AI-powered recommendations
      </p>

      {/* SEARCH INPUT + DROPDOWN */}
      <div className="relative mb-4">
        <Input
          value={search}
          placeholder="Search songs or artists..."
          onChange={(e) => setSearch(e.target.value)}
        />

        {results.length > 0 && (
          <div className="absolute z-50 w-full bg-white border rounded shadow max-h-60 overflow-y-auto mt-1">
            {results.map((song, i) => (
              <div
                key={i}
                className="p-2 cursor-pointer hover:bg-gray-100 flex items-center gap-3"
                onClick={() => addSong(song)}
              >
                {song.image && (
                  <img src={song.image} className="w-8 h-8 rounded" alt="" />
                )}
                <div>
                  <p className="font-medium text-sm text-gray-800">{song.name}</p>
                  <p className="text-xs text-gray-500">{song.artist}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SELECTED SONGS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {songs.map((s) => (
          <Badge
            key={s.id}
            className="cursor-pointer"
            onClick={() => removeSong(s.id)}
          >
            {s.name} — {s.artist} ✕
          </Badge>
        ))}
      </div>

      {/* BUTTON */}
      <Button
        onClick={recommend}
        disabled={songs.length === 0 || loading}
        className="mb-6"
      >
        {loading ? "Running Model..." : "Get Recommendations"}
      </Button>

      {/* ERROR */}
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* RESULTS */}
      <div className="grid md:grid-cols-2 gap-4">
        {recommendations.map((r, i) => (
          <Card key={i} className="p-4 bg-zinc-900 border-zinc-800 flex gap-4 items-center">
            {r.image && (
              <img src={r.image} className="w-14 h-14 rounded" alt={r.name} />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{r.name}</h3>
              <p className="text-sm text-zinc-400 truncate">{r.artist}</p>
              <p className="text-xs text-zinc-500">{r.album}</p>
            </div>
            <a
              href={r.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 text-xs shrink-0 hover:underline"
            >
              Open ↗
            </a>
          </Card>
        ))}
      </div>

    </div>
  );
}