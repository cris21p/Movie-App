const API_KEY = "ffa0698f";

const input = document.getElementById('input');
const button = document.getElementById('button');
const movi = document.getElementById('movi');

function buscarPeliculas(query) {
  movi.innerHTML = "<p>Cargando...</p>";
  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (data.Response === "True") {
        movi.innerHTML = "";
        data.Search.forEach(movie => {
          // Por cada película, pide la descripción
          fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`)
            .then(res => res.json())
            .then(fullMovie => {
              const plot = fullMovie.Plot || 'Sin descripción.';
              const plotLimit = 150;
              const plotShort = plot.length > plotLimit ? plot.substring(0, plotLimit) + "..." : plot;
              movi.innerHTML += `
                <div class="movi-card">
                  <div>
                    <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200x300?text=Sin+imagen'}" alt="${movie.Title}">
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