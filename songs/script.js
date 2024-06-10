import flamethrower from "../flamethrower-router.js";
export const router = flamethrower({ log: true, prefetch: "visible", pageTransitions: true });

import { API_URL, removeLoading, toast, useFetch, sleep } from "../main.js";
const SearchField = document.getElementById("search");

const songsList = [];

async function main() {
  const songs = await useFetch(`${API_URL}/songs`);

  if (songs.error) {
    toast("Failed to load songs", "error");
    return;
  }

  await sleep(500);

  InsertSongs(songs.data);
  songsList.push(...songs.data);
  document.title = `Sing Online - ${songsList.length} Songs`;
  removeLoading();

  // SearchField
  SearchField.addEventListener("input", (event) => {
    const { value } = event.target;

    const filteredSongs = songsList.filter((song) => {
      return song.title.toLowerCase().includes(value.toLowerCase());
    });

    if (filteredSongs.length === 0) {
      toast(`Ingen sange fundet med søgningen: ${value}`, "info");
    }

    InsertSongs(filteredSongs);
  });
}

function InsertSongs(data) {
  const list = document.getElementById("songs-list");

  list.innerHTML = `${data
    .map(
      (song) => `
  <div class="card">
    <h1>${song.title}</h1>
    <p>
      <strong>Artist:</strong> ${song.artist.name}
    </p>
    <button class="btn">
      <a href="/songs/view/?id=${song.id}">View</a>
    </button>
  </div>
  `
    )
    .join("")}`;
}

main();
