import flamethrower from "../../flamethrower-router.js";
export const router = flamethrower({ log: true, prefetch: "visible", pageTransitions: true });
import { API_URL, removeLoading, sleep, toast, useFetch } from "../../main.js";

async function main() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return toast("Invalid song ID", "error");

  const song = await useFetch(`${API_URL}/songs/${id}`);
  if (song.error) return toast("Failed to load song", "error");

  await sleep(500);
  removeLoading();

  document.title = `Sing Online - ${song.data.title}`;

  const SongContainer = document.getElementById("songs-details");

  SongContainer.innerHTML = `
  <div class="song-details-top">
    <h1>${song.data.title}</h1>

    <div>
      <button class="btn">
      <a href="/songs/edit/?id=${song.data.id}">
        Rediger
      </a>
    </button>
    <button class="btn danger" id="delete-song" data-id="${song.data.id}">
      Slet
    </button>
    </div>
  </div>
    <p>
      <strong>Artist:</strong> ${song.data.artist.name}
    </p>
    `;

  const deleteButton = document.getElementById("delete-song");
  deleteButton.addEventListener("click", async () => {
    const confirmDelete = confirm("Er du sikker på at du vil slette denne sang?");
    if (!confirmDelete) return;

    const deleteSong = await useFetch(`${API_URL}/songs/${id}`, {
      method: "DELETE",
    });

    if (deleteSong.error) return toast("Failed to delete song", "error");

    toast("Song deleted successfully", "success");
    await sleep(2000);
    window.location.href = "/songs";
  });
}

main();
