import flamethrower from "../../flamethrower-router.js";
export const router = flamethrower({ log: true, pageTransitions: true });

import { API_URL, removeLoading, sleep, toast, useFetch } from "../../main.js";
const EditForm = document.querySelector(".edit-form");

async function main() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return toast("Invalid song ID", "error");

  const song = await useFetch(`${API_URL}/songs/${id}`);
  if (song.data.error) return toast("Failed to load song", "error");

  await sleep(500);
  removeLoading();

  document.title = `Sing Online - EDIT ${song.data.title}`;

  console.log(song.data);

  EditForm.style.display = "block";

  const TitleField = document.getElementById("title");
  const Content = document.getElementById("content");

  TitleField.value = song.data.title;
  Content.value = song.data.content;
}

main();
