const apiKey = "42d949e7a2b24450a908f78d58785fd1";
const baseUrl = `https://api.rawg.io/api/games?key=${apiKey}`;
let url = `${baseUrl}&page_size=50`;

let currentPage = 1;
let totalPages = 1;
const itemsPerPage = 9;

const searchItem = document.querySelector(".search");
const searchForm = document.querySelector("form");
const section = document.querySelector("section");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

document.addEventListener("DOMContentLoaded", fetchDefaultGames);
searchForm.addEventListener("submit", fetchResult);
prevBtn.addEventListener("click", () => changePage(-1));
nextBtn.addEventListener("click", () => changePage(1));

function fetchDefaultGames() {
  fetch(url)
    .then((result) => result.json())
    .then((json) => {
      totalPages = Math.ceil(json.results.length / itemsPerPage);
      displayResults(json);
      updatePaginationButtons();
    });
}

function fetchResult(event) {
  event.preventDefault();
  currentPage = 1;
  url = `${baseUrl}&search=${searchItem.value}`;
  fetch(url)
    .then((result) => result.json())
    .then((json) => {
      totalPages = Math.ceil(json.results.length / itemsPerPage);
      displayResults(json);
      updatePaginationButtons();
    });
}

function displayResults(json) {
  const flexCont = document.getElementById("flexCont");
  while (flexCont.firstChild) {
    flexCont.removeChild(flexCont.firstChild);
  }
  const games = json.results;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedGames = games.slice(start, end);

  if (paginatedGames.length === 0) {
    const para = document.createElement("p");
    para.textContent = "No games matching your search";
    section.appendChild(para);
  } else {
    paginatedGames.forEach((game) => {
      const div = document.createElement("div");
      div.classList.add("card");
      const imgLink = document.createElement("a");
      const img = document.createElement("img");
      img.src = game.background_image;
      img.alt = game.name;
      const container = document.createElement("div");
      container.classList.add("container");
      const title = document.createElement("h4");
      const bold = document.createElement("b");
      bold.textContent = game.name;
      const info = document.createElement("p");
      info.textContent = `Released: ${game.released} | Rating: ${game.rating}`;
      title.appendChild(bold);
      imgLink.appendChild(img);
      div.appendChild(imgLink);
      div.appendChild(container);
      container.appendChild(title);
      container.appendChild(info);
      flexCont.appendChild(div);
    });
  }
}

function changePage(direction) {
  currentPage += direction;
  fetch(url)
    .then((result) => result.json())
    .then((json) => {
      displayResults(json);
      updatePaginationButtons();
    });
}

function updatePaginationButtons() {
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}
