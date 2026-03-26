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

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/search?q=${encodeURIComponent(search)}`
        );
        const data = await res.json();
        setResults(data || []);
      } catch (err) {
        console.error(err);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [search]);

  // -----------------------------
  // ADD / REMOVE SONG
  // -----------------------------
  const addSong = (song) => {
    if (!song) return;
    if (!songs.find((s) => s.name === song.name && s.artist === song.artist)) {
      setSongs([...songs, song]);
    }
    setSearch("");
    setResults([]);
  };

  const removeSong = (name, artist) => {
    setSongs(songs.filter((s) => !(s.name === name && s.artist === artist)));
  };

  // -----------------------------
  // GET RECOMMENDATIONS
  // -----------------------------
  const recommend = async () => {
    if (songs.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const songNames = songs.map((s) => `${s.name} ${s.artist}`);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/recommend`, {
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
  // SEND FEEDBACK
  // -----------------------------
  const sendFeedback = async (track, liked) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: track.name, artist: track.artist, liked }),
      });

      if (!liked) {
        setRecommendations(recommendations.filter((r) => r.name !== track.name));
      }
    } catch (err) {
      console.error("Feedback error:", err);
    }
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
                <img
                  src={song.image || "https://via.placeholder.com/64?text=No+Image"}
                  alt={song.name}
                  className="w-10 h-10 rounded"
                />
                <div className="truncate">
                  <p className="font-medium text-sm text-gray-800 truncate">{song.name}</p>
                  <p className="text-xs text-gray-500 truncate">{song.artist}</p>
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
            key={`${s.name}-${s.artist}`}
            className="cursor-pointer"
            onClick={() => removeSong(s.name, s.artist)}
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
            <img
              src={r.image || "https://via.placeholder.com/64?text=No+Image"}
              className="w-14 h-14 rounded"
              alt={r.name}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{r.name}</h3>
              <p className="text-sm text-zinc-400 truncate">{r.artist}</p>
              <p className="text-xs text-zinc-500 truncate">{r.album}</p>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="text-green-400 hover:bg-green-900"
                onClick={() => sendFeedback(r, true)}
              >
                👍
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-400 hover:bg-red-900"
                onClick={() => sendFeedback(r, false)}
              >
                👎
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}