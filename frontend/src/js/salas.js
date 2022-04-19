const socket = io();

let clientId = null;
let gameId = null;
let playerColor = null;

const divGames = document.getElementById("divGames");
socket.on("connectgame", (payload) => {
  console.log("payload", payload);
  clientId = payload.clientId;

  while (divGames.firstChild) divGames.removeChild(divGames.firstChild);

  const { games } = payload;
  const availabeGames = Object.keys(games);
  for (let i = 0; i < availabeGames.length; i++) {
    const div = document.createElement("div");
    div.id = `game${i + 1}`;
    div.tag = availabeGames[i];
    div.textContent = i + 1;
    div.style.width = "150px";
    div.style.height = "150px";
    div.style.backgroundColor = "#3d375e7f";
    div.addEventListener("drop", (e) => {
      const payload = {
        clientId: clientId,
        gameId: div.tag,
      };

      gameId = div.tag;
      socket.emit("join", payload);
    });
    div.addEventListener("dragover", (e) => {
      allowDrop(e);
    });
    div.addEventListener("dragleave", (e) => {
      leave(e);
    });
    divBoard.appendChild(div);
  }
});
const sesionUser = JSON.parse(localStorage.getItem("sesionUser"));
const url = "http://localhost:3001/salas/guardar";

document.getElementById("avatar").setAttribute("src", sesionUser.avatar);

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

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
  ev.target.style.display = "block";
  ev.target.style.opacity = "1";
  salaElegida();
}

// Este bloque cambia la opacidad de la sala cuando el avatar abandona la mitad del recuadro de sala.
// Ademas extrae y borra lo que contiene el elemento con id elegida, es decir la sala elegida.
function leave(ev) {
  ev.target.style.opacity = "1";
  let elegida = document.getElementById("elegida");
  elegida.innerHTML = "";
}

// Este bloque mira que en las diferentes casillas de game contenga el avatar, si es asi asigna el numero de la sala.
// Despues lo imprimimos en pantalla.
// TODO: Arreglar bug de guardado sala si sales del recuadro pero vuelves a la misma sala.
// Y emparejar dato de salaJugador en localstorage con el email del usuario que haga login
async function salaElegida() {
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
  socket.emit("create", clientId);

  // window.location.href = "/juego";

  // Nose si es muy util esta parte, con la redireccion al juego no se ve el numero de sala!
  // let elegida = document.getElementById("elegida");
  // elegida.insertAdjacentHTML("afterbegin", sala);
  localStorage.salaJugador = sala;
}

socket.on("create", (game) => {
  const { id, cells } = game;
  gameId = id;
  let elegida = document.getElementById("elegida");
  elegida.insertAdjacentHTML("afterbegin", id);
  console.log(
    `partida con el id ${id} de ${cells} celdas, creada correctamente`
  );
});

const btnJoin = document.getElementById("btnJoin");
btnJoin.addEventListener("click", (e) => {
  console.log(gameId);
  if (gameId === null) gameId = txtGameId.value;
  console.log(gameId);
  const payload = {
    clientId: clientId,
    gameId: gameId,
  };

  socket.emit("join", payload);
});

const divPlayers = document.getElementById("divPlayers");
const divBoard = document.getElementById("divBoard");
const txtGameId = document.getElementById("txtGameId");
socket.on("join", (game) => {
  while (divPlayers.firstChild) divPlayers.removeChild(divPlayers.firstChild);

  game.players.forEach((player) => {
    const div = document.createElement("div");
    div.style.width = "200px";
    div.style.background = player.color;
    div.textContent = player.playerId;
    divPlayers.appendChild(div);

    if (player.playerId === clientId) playerColor = player.color;
  });

  while (divBoard.firstChild) divBoard.removeChild(divBoard.firstChild);

  for (let i = 0; i < game.cells; i++) {
    const b = document.createElement("button");
    b.id = `cell${i + 1}`;
    b.tag = i + 1;
    b.textContent = i + 1;
    b.style.width = "150px";
    b.style.height = "150px";
    b.addEventListener("click", (e) => {
      b.style.background = playerColor;
      const payload = {
        clientId: clientId,
        gameId: gameId,
        cellId: b.tag,
        color: playerColor,
      };
      socket.emit("play", payload);
    });
    divBoard.appendChild(b);
  }
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
