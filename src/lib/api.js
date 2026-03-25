const BASE_URL = "http://127.0.0.1:5000";

export async function searchSongs(query) {
  const res = await fetch(`${BASE_URL}/search?q=${query}`);
  return res.json();
}

export async function getRecommendations(songs) {
  const res = await fetch(`${BASE_URL}/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ songs }),
  });

  return res.json();
}