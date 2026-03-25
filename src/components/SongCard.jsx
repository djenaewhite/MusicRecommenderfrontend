import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SongCard({ song }) {
  return (
    <Card className="p-4 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 transition">
      <h3 className="font-semibold">{song.track_name}</h3>
      <p className="text-sm text-zinc-400">
        {song.artist_name}
      </p>

      <Badge className="mt-2">{song.genre}</Badge>
    </Card>
  );
}