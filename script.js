const API_KEY = "ffa0698f";

const input = document.getElementById('input');
const button = document.getElementById('button');
const movi = document.getElementById('movi');
const bt = document.getElementById('bt');
const Search = document.getElementById('Search');
const perfil = document.getElementById("perfil");

const navSearch = document.querySelector('.search');
const mianSearch = document.querySelector('.ct-search');

// Evento para buscar al hacer click
button.addEventListener('click', function(e) {
  e.preventDefault();
  const query = input.value.trim();
  if (!query) return
    buscarPeliculas(query)
})

bt.addEventListener('click', function(e) {
  e.preventDefault();
  const query = Search.value.trim()
  if (!query) return
    buscarPeliculas(query)
})

function buscarPeliculas(query) {
  movi.innerHTML = `
    <div class="spinner-border" style="width: 4rem; height: 4rem;" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>`;

  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {

      if (mianSearch) mianSearch.style.display = "none";
      if (navSearch) navSearch.style.display = "flex";

      if (data.Response === "True") {
        movi.innerHTML = "";
        data.Search.forEach(movie => {
          // Usamos siempre "movie" en vez de "peli" o "perfil"
          movi.innerHTML += `
            <div class="movi-card" data-imdb="${movie.imdbID}">
              <a href="/pelicula/${movie.imdbID}">
                <img src="${movie.Poster}" onerror="this.onerror=null;this.src='/img/Imagen.jpg';" alt="${movie.Title}">
                <div>
                  <h3 class="movie-title">${movie.Title}</h3>
                </div>
              </a>
            </div>
          `;
        });

        // ¡Importante! Agrega los listeners después de que el HTML fue insertado
        movi.querySelectorAll('a').forEach(enlace => {
          enlace.onclick = (e) => {
            e.preventDefault();
            // Busca el imdbID en el div padre
            const imdbID = enlace.closest('.movi-card').dataset.imdb;
            history.pushState({imdb: imdbID}, '', `/pelicula/${imdbID}`);
            mostrarPerfil(imdbID);
          };
        });

      } else {
        movi.innerHTML = `<p class="not-found">No se encontraron resultados.</p>`;
      }
    })
    .catch(err => {
      movi.innerHTML = `<p class="not-found">Error al buscar películas.</p>`;
    });
}

  function mostrarPerfil(imdbID) {
  movi.style.display="none";
  perfil.style.display="flex";
  perfil.innerHTML = `
    <div class="spinner-border" style="width: 4rem; height: 4rem;" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>`;

  // Consultamos la API de OMDb para obtener detalles completos usando el imdbID
  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`)
    .then(res => res.json())
    .then(movie => {
      if(movie.Response === "True") {
        // Mostramos los detalles de la película
        perfil.innerHTML = `
            <div class="peli-post">
                <img src="${movie.Poster}" alt="Poster de ${movie.Title}">
            </div>
            <div class="text">
                <h1 class="title">
                    ${movie.Title} (${movie.Year})
                </h1>
                <h3>Sinopsis:</h3>
                <p>${movie.Plot}</p>
                <h4>Actores: </h4>
                <p>${movie.Actors}</p>
                <h4>Director:</h4>
                <p>${movie.Director}</p>
            </div>
        `;
        // Botón para volver a los resultados de búsqueda
        document.getElementById('volver').onclick = () => {
          history.back();
        };
      } else {
        perfil.innerHTML = 'No se pudo cargar la información.<br><button id="volver">Volver</button>';
        document.getElementById('volver').onclick = () => { history.back(); };
      }
    });
}

// Manejar navegación SPA con popstate (atrás/adelante del navegador)
window.addEventListener('popstate', (event) => {
  const path = window.location.pathname.split('/');
  if (path[1] === "pelicula" && path[2]) {
    mostrarPerfil(path[2]);
  } else {
    movi.style.display="flex";
    perfil.style.display="none";
  }
});

function iniciar() {
  const path = window.location.pathname.split('/');
  if (path[1] === "pelicula" && path[2]) {
    mostrarPerfil(path[2]);
  }
}
iniciar();

