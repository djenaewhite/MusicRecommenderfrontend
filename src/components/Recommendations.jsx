import { useState } from "react";
import SongSearch from "../components/SongSearch";
import { getRecommendations } from "@/lib/api";

export default function Recommender() {
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);

  const addSong = (song) => {
    if (!selectedSongs.find(s => s.track_name === song.track_name)) {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const removeSong = (name) => {
    setSelectedSongs(selectedSongs.filter(s => s.track_name !== name));
  };

  const getRecs = async () => {
    setLoading(true);
    try {
      const songNames = selectedSongs.map(s => s.track_name);
      const data = await getRecommendations(songNames);
      setRecs(data.recommendations || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Music Recommender</h1>

      {/* SEARCH */}
      <SongSearch onSelect={addSong} />

      {/* SELECTED */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Selected Songs</h2>

        {selectedSongs.map((s, i) => (
          <div
            key={i}
            className="p-2 border rounded flex justify-between"
          >
            <span>
              {s.track_name} — {s.artist_name}
            </span>

            <button
              onClick={() => removeSong(s.track_name)}
              className="text-red-500"
            >
              remove
            </button>
          </div>
        ))}
      </div>

      {/* BUTTON */}
      <button
        onClick={getRecs}
        disabled={selectedSongs.length === 0 || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Loading..." : "Get Recommendations"}
      </button>

      {/* RESULTS */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Recommendations</h2>

        {recs.map((r, i) => (
          <div key={i} className="p-2 border rounded">
            {r.track_name} — {r.artist_name}
          </div>
        ))}
      </div>
    </div>
  );
}