import { useState, useEffect } from "react";

export default function SongSearch({ onSelect }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetch(`http://127.0.0.1:5000/search?q=${search}`)
        .then(res => res.json())
        .then(data => setResults(data || []));
    }, 200);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="relative">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search songs..."
        className="border p-2 w-full"
      />

      {results.length > 0 && (
        <div className="absolute bg-white border w-full mt-1 max-h-60 overflow-y-auto z-50">
          {results.map((song, i) => (
            <div
              key={i}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(song);   // 🔥 MUST pass full object
                setSearch("");
                setResults([]);
              }}
            >
              <div className="font-sm text-gray-500">{song.track_name}</div>
              <div className="text-sm text-gray-500">
                {song.artist_name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}