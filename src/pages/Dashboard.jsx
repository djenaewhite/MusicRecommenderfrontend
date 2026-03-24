import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [songInput, setSongInput] = useState("");
  const [songs, setSongs] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addSong = () => {
    if (!songInput.trim()) return;
    setSongs([...songs, songInput.trim()]);
    setSongInput("");
  };

  const removeSong = (index) => {
    setSongs(songs.filter((_, i) => i !== index));
  };

  const getRecommendations = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songs }),
      });

      const data = await res.json();
      setResults(data.recommendations || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-2">
        Music Recommendation Engine
      </h1>
      <p className="text-zinc-400 mb-6">
        Enter songs you like and get AI-powered recommendations
      </p>

      {/* INPUT SECTION */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Type a song name..."
          value={songInput}
          onChange={(e) => setSongInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addSong()}
        />

        <Button onClick={addSong}>Add</Button>
      </div>

      {/* SONG TAGS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {songs.map((s, i) => (
          <Badge
            key={i}
            className="cursor-pointer"
            onClick={() => removeSong(i)}
          >
            {s} ✕
          </Badge>
        ))}
      </div>

      {/* ACTION BUTTON */}
      <Button
        onClick={getRecommendations}
        disabled={songs.length === 0 || loading}
        className="mb-8"
      >
        {loading ? "Thinking..." : "Get Recommendations"}
      </Button>

      {/* RESULTS */}
      <div className="grid md:grid-cols-2 gap-4">
        {results.map((r, i) => (
          <Card key={i} className="p-4 bg-zinc-900 border-zinc-800">
            <h3 className="font-semibold">{r.track_name}</h3>
            <p className="text-sm text-zinc-400">{r.artist_name}</p>
            <Badge className="mt-2">{r.genre}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
