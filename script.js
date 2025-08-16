const API_KEY = "ffa0698f";

const input = document.getElementById('input');
const button = document.getElementById('button');
const movi = document.getElementById('movi');
const bt = document.getElementById('bt');
const Search = document.getElementById('Search');

const navSearch = document.querySelector('.search');
const mianSearch = document.querySelector('.ct-search');

function buscarPeliculas(query) {
  movi.innerHTML = "<p>Cargando...</p>";
  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {

      if (mianSearch) mianSearch.style.display = "none";
      if (navSearch) navSearch.style.display = "flex";

      if (data.Response === "True") {
        movi.innerHTML = "";
        data.Search.forEach(movie => {
          // Por cada película, pide la descripción
          fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`)
            .then(res => res.json())
            .then(fullMovie => {
              const plot = fullMovie.Plot || 'Sin descripción.';
              const plotLimit = 100;
              const plotShort = plot.length > plotLimit ? plot.substring(0, plotLimit) + "..." : plot;
              movi.innerHTML += `
                <div class="movi-card">
                  <div>
                    <img src="${movie.Poster}" onerror="this.onerror=null;this.src='/img/Imagen.jpg';" alt="${movie.Title}">
                  </div>
                  <h3 class="movie-title">${movie.Title}</h3>
                  <p class="movie-year">${movie.Year}</p>
                  <p class="movie-plot">${plotShort}</p>
                </div>
              `;
            });
        });
      } else {
        movi.innerHTML = `<p class="not-found">No se encontraron resultados.</p>`;
      }
    })
    .catch(err => {
      movi.innerHTML = `<p class="not-found">Error al buscar películas.</p>`;
    });
}

// Evento para buscar al hacer click
button.addEventListener('click', function(e) {
  e.preventDefault();
  const query = input.value.trim();
  if (query) {
    buscarPeliculas(query);
  }
});

bt.addEventListener('click', function(e) {
  e.preventDefault();
  const query = Search.value.trim();
  if (query){
    buscarPeliculas(query);
  }
});