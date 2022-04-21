// CONSTANTES
const socket = io();
const sesionUser = JSON.parse(localStorage.getItem("sesionUser"));

// VARIABLES GENERALES
let clientId = null;
let gameId = null;
let playerColor = null;

// ELEMENTOS
const divGames = document.getElementById("divGames");
const divNoGames = document.getElementById("noGameContainer");
const createButton = document.getElementById("createGameButton");

// CAMBIA EL AVATAR POR EL SELECCIONADO POR EL USER
document.getElementById("avatar").setAttribute("src", sesionUser.avatar);

// BOTON PARA CREAR UNA NUEVA PARTIDA
createButton.addEventListener("click", () => {
  socket.emit("create", clientId);
});

// UN USUARIO ENTRA EN EL JUEGO
socket.on("connectgame", (payload) => {
  const data = JSON.parse(payload);
  clientId = data.clientId;

  while (divGames.firstChild) divGames.removeChild(divGames.firstChild);

  const { games } = data;
  const availabeGames = Object.keys(games);

  if (availabeGames.length === 0) {
    divNoGames.style.display = "flex";
  } else {
    // pinta el numero de salas creadas
    for (let i = 0; i < availabeGames.length; i++) {
      const div = document.createElement("div");
      div.id = `game${i + 1}`;
      div.className = "game";
      div.tag = availabeGames[i];
      div.textContent = `Jugadores: ${Object.values(games)[i].players.length}`;
      div.style.width = "150px";
      div.style.height = "150px";

      // eventos
      div.addEventListener("drop", (e) => {
        const payload = {
          clientId: clientId,
          gameId: div.tag,
        };

        gameId = div.tag;
        drop(e, payload);
      });

      div.addEventListener("dragover", (e) => {
        allowDrop(e);
      });

      div.addEventListener("dragleave", (e) => {
        leave(e);
      });

      // mete cada sala en el contenedor padre
      divGames.className = "games-container";
      divGames.appendChild(div);
    }
  }
});

function dragstart(e) {
  this.style.opacity = "0.1";
}

function allowDrop(ev) {
  ev.target.style.opacity = "0.4";
  ev.preventDefault();
}

function drag(ev) {
  ev.cursor = "pointer";
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev, payload) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
  ev.target.style.display = "block";
  ev.target.style.opacity = "1";
  salaElegida(payload);
}

// Este bloque cambia la opacidad de la sala cuando el avatar abandona la mitad del recuadro de sala.
// Ademas extrae y borra lo que contiene el elemento con id elegida, es decir la sala elegida.
function leave(ev) {
  console.log("leave");
  ev.target.style.opacity = "1";
  let elegida = document.getElementById("elegida");
  elegida.innerHTML = "";
}

// Este bloque mira que en las diferentes casillas de game contenga el avatar, si es asi asigna el numero de la sala.
// Despues lo imprimimos en pantalla.
// TODO: Arreglar bug de guardado sala si sales del recuadro pero vuelves a la misma sala.
// Y emparejar dato de salaJugador en localstorage con el email del usuario que haga login
async function salaElegida(payload) {
  if (game1.contains(avatar)) {
    sala = 1;
  } else if (game2.contains(avatar)) {
    sala = 2;
  } else if (game3.contains(avatar)) {
    sala = 3;
  } else if (game4.contains(avatar)) {
    sala = 4;
  } else {
    sala = "";
  }
  socket.emit("join", payload);

  // window.location.href = "/juego";
}

socket.on("waitPlayer", () => {
  const divMessage = document.getElementById("waitPlayer");
  divMessage.style.display = "flex";
});

// EVENTO QUE SE ENVIA AL SERVER PARA CREAR UNA PARTIDA
socket.on("create", (game) => {
  const { id } = game;
  gameId = id;
  let elegida = document.getElementById("elegida");
  elegida.insertAdjacentHTML("afterbegin", id);

  // guarda datos de la partida en localStorage
  const gameData = {
    id,
  };
  localStorage.setItem("sesionGame", JSON.stringify(gameData));

  // recarga la pagina para que se vea la nueva sala
  window.location.reload();
});

// const btnJoin = document.getElementById("btnJoin");
// btnJoin.addEventListener("click", (e) => {
//   console.log(gameId);
//   if (gameId === null) gameId = txtGameId.value;
//   console.log(gameId);
//   const payload = {
//     clientId: clientId,
//     gameId: gameId,
//   };

//   socket.emit("join", payload);
// });

// const divPlayers = document.getElementById("divPlayers");
// const divBoard = document.getElementById("divBoard");
// const txtGameId = document.getElementById("txtGameId");
// socket.on("join", (game) => {
//   while (divPlayers.firstChild) divPlayers.removeChild(divPlayers.firstChild);

//   game.players.forEach((player) => {
//     const div = document.createElement("div");
//     div.style.width = "200px";
//     div.style.background = player.color;
//     div.textContent = player.playerId;
//     divPlayers.appendChild(div);

//     if (player.playerId === clientId) playerColor = player.color;
//   });

//   while (divBoard.firstChild) divBoard.removeChild(divBoard.firstChild);

//   for (let i = 0; i < game.cells; i++) {
//     const b = document.createElement("button");
//     b.id = `cell${i + 1}`;
//     b.tag = i + 1;
//     b.textContent = i + 1;
//     b.style.width = "150px";
//     b.style.height = "150px";
//     b.addEventListener("click", (e) => {
//       b.style.background = playerColor;
//       const payload = {
//         clientId: clientId,
//         gameId: gameId,
//         cellId: b.tag,
//         color: playerColor,
//       };
//       socket.emit("play", payload);
//     });
//     divBoard.appendChild(b);
//   }
// });

// REDIRIGE AL JUEGO CUANDO HAY DOS JUGADORES
socket.on("gameStart", () => {
  window.location.href = "/juego";
});

socket.on("update", (game) => {
  //{1: "red", 2: "blue"}
  console.log("update game", game);
  if (!game.state) return;
  const { state } = game;
  for (const cell of Object.keys(state)) {
    const color = state[cell];
    const cellObject = document.getElementById("cell" + cell);
    cellObject.style.backgroundColor = color;
  }
});

// Alerta de que ya hay dos jugadores en la sala
socket.on("toMuchPlayers", () => {
  const divMessage = document.getElementById("toMuchPlayersContainer");
  divMessage.style.display = "flex";
  setTimeout(() => {
    divMessage.style.display = "none";
  }, 5000);
});

const headerNameElement = document.getElementById("username");

headerNameElement.insertAdjacentHTML(
  "beforeend",
  sesionUser.name ? `${sesionUser.name}!` : "Jugador!"
);

const logout = () => {
  localStorage.removeItem("sesionUser");
  window.location.href = "/login";
};

let logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", logout, false);
