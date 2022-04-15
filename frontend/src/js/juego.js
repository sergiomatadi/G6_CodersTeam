const sesionUser = JSON.parse(localStorage.getItem("sesionUser"));
const selectedSala = JSON.parse(localStorage.getItem("salaJugador"));
const url = "http://localhost:3001/";
const userEndpoint = "users/get_opponent";
const salaEndpoint = "salas/save_game_data";

/*Function to creat layout and pixels*/

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");


for(var i=0; i<6; i++) {
  for(var j=0; j<6; j++) {
    ctx.beginPath();
    ctx.rect(50*(i), 25*j, 50, 25);
    ctx.stroke();
    
  }
}

function changeColor(id) {
  document.getElementById(id).style.backgroundColor='blue';
}
// TODO: Refactorizar este codigo
const getGameData = async () => {
  // Obtiene un oponente del back
  const fetchData = await fetch(
    `${url}${userEndpoint}?user=${sesionUser.email}`
  );

  const { content, statusCode } = await fetchData.json();
  // REVISAMOS QUE HAYA OPONENTE
  if (statusCode === 200 && content) {
    const anfitrionNameEl = document.getElementById("anfitrionPlayer");
    const opponentNameEl = document.getElementById("opponentPlayer");

    const opponentImageEl = document.getElementById("opponentImage");
    const anfitrionImageEl = document.getElementById("anfitrionImage");

    // elementos para manejar la puntuación de cada jugador --> POR HACER!
    const opponentScoreEl = document.getElementById("opponentScore");
    const anfitrionScore = document.getElementById("anfitrionScore");

    // rellenamos el html
    opponentNameEl.insertAdjacentHTML(
      "beforeend",
      content.user ? `${content.user}` : "Oponente!"
    );
    anfitrionNameEl.insertAdjacentHTML(
      "beforeend",
      sesionUser.name ? `${sesionUser.name}` : "Anfitrión!"
    );

    opponentImageEl.setAttribute("src", content.avatar);
    anfitrionImageEl.setAttribute("src", sesionUser.avatar);

    const data = {
      player1: {
        name: sesionUser.name,
        puntuacion: 0,
      },
      player2: {
        name: content.name,
        puntuacion: 0,
      },
      idSala: selectedSala,
    };

    // Guarda los datos de la sala en el server
    const saveGameData = await fetch(url + salaEndpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const res = await saveGameData.json();
  } else {
    const searchingTitleEl = document.getElementById("buscandoOponente");
    searchingTitleEl.classList.remove("d-none");
    searchingTitleEl.classList.add("d-block");
    // SI NO HAY OPONENTE REDIRIGIMOS A SALAS
    // Añadida ventana de alerta para mejorar el flujo en ese error.
    setTimeout(function () {
      searchingTitleEl.classList.remove("d-block");

      alert("No hay oponentes en el server");
    }, 10000);

    setTimeout(function () {
      window.location.href = "/salas";
      console.error("No hay oponentes en el server");
    }, 12000);
  }
};

window.addEventListener("load", getGameData, false);
