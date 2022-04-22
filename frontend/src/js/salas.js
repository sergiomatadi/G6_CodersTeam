if (!localStorage.getItem("sesionUser")) {
  window.location.href = "/login";
} else {
  // CONSTANTES
  const socket = io();
  const sesionUser = JSON.parse(localStorage.getItem("sesionUser"));

  // VARIABLES GENERALES
  let clientId = null;
  let gameId = null;
  let playerColor = null;

  // ELEMENTOS PARA LAS SALAS
  const divGames = document.getElementById("divGames");
  const divNoGames = document.getElementById("noGameContainer");
  const createButton = document.getElementById("createGameButton");

  // CAMBIA EL AVATAR POR EL SELECCIONADO POR EL USER
  document.getElementById("avatar").setAttribute("src", sesionUser.avatar);

  // BOTON PARA CREAR UNA NUEVA PARTIDA
  createButton.addEventListener("click", () => {
    socket.emit("create", clientId);
  });

  // UN USUARIO ENTRA EN EL JUEGO - EMPIEZA LA CONEXION SOCKET
  socket.on("connectgame", (payload) => {
    const data = JSON.parse(payload);
    clientId = data.clientId;

    while (divGames.firstChild) divGames.removeChild(divGames.firstChild);

    const { games } = data;
    const availabeGames = Object.keys(games);

    if (availabeGames.length === 0) {
      divNoGames.style.display = "flex"; // Informa de que no hay ninguna sala creada
    } else {
      // pinta el numero de salas creadas
      for (let i = 0; i < availabeGames.length; i++) {
        const div = document.createElement("div");
        div.id = `game${i + 1}`;
        div.className = "game";
        div.tag = availabeGames[i];
        div.textContent = `Jugadores: ${
          Object.values(games)[i].players.length
        }`;
        div.style.width = "150px";
        div.style.height = "150px";

        // eventos
        div.addEventListener("drop", (e) => {
          const payload = {
            clientId: clientId,
            gameId: div.tag,
            playerInfo: sesionUser,
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

  // FUNCIONES DE ARRASTRADO
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
    // Emite el evento que escucha el server para unir un jugador a una sala
    socket.emit("join", payload);
  }

  // INFORMA A UN USUARIO QUE ESPERE A OTRA JUGADOR
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

  // MUESTRA EL JUEGO CUANDO HAY DOS JUGADORES
  socket.on("gameStart", () => {
    const salasContainer = document.querySelector("#salas");
    const gameContainer = document.querySelector("#game");
    salasContainer.style.display = "none";
    gameContainer.style.display = "flex";
  });

  // Alerta de que ya hay dos jugadores en la sala
  socket.on("toMuchPlayers", () => {
    const divMessage = document.getElementById("toMuchPlayersContainer");
    divMessage.style.display = "flex";
    setTimeout(() => {
      divMessage.style.display = "none";
    }, 5000);
  });

  socket.on("join", (game) => {
    if (!game) return; // si game no existe, no entra el juego

    // CREA UNA CARD PARA CADA JUGADOR EN LA PARTIDA
    const divPlayers = document.querySelector("#players");
    game.players.forEach((player) => {
      // Div para la card de cada jugador
      const div = document.createElement("div");
      div.className = "player-container";
      div.style.background = player.color;

      // Border top
      const borderTop = document.createElement("div");
      borderTop.className = "player-border-top";
      div.appendChild(borderTop);

      // Avatar
      const img = document.createElement("img");
      img.className = "player-avatar";
      img.setAttribute("src", player.info.avatar);
      div.appendChild(img);

      // Nombre
      const name = document.createElement("span");
      name.textContent = player.info.name;
      div.appendChild(name);

      // Puntuación
      const score = document.createElement("p");
      score.className = "player-score";
      score.textContent = "Celdas: 0";
      div.appendChild(score);

      if (player.playerId === clientId) playerColor = player.color;

      divPlayers.appendChild(div);
    });

    /* COMENTAR ESTE CODIGO SI QUEREIS TESTEAR LOS BOTONES EN LUGAR DEL CANVAS */
    // TODO: AÑADIR LOS EVENTOS ONCLICK EN CADA UNA DE LAS CELDAS
    const divGame = document.querySelector("#game");
    const canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.style.width = "502px";
    canvas.style.height = "502px";

    var ctx = canvas.getContext("2d");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#3d375e7f";

    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 6; j++) {
        ctx.beginPath();
        ctx.rect(50 * i, 25 * j, 50, 25);
        ctx.stroke();
      }
    }

    divGame.appendChild(canvas);
    /* END PARA COMENTAR */

    /* DESCOMENTAR ESTE BLOQUE PARA TESTEAR EL JUEGO CON BOTONES EN LUGAR DE CANVAS
       TAMBIEN DESCOMENTAR UNA LINEA EN EL HTML DE SALAS
    */
    //   const divBoard = document.querySelector("#board");
    //   while (divBoard.firstChild) divBoard.removeChild(divBoard.firstChild);

    //   for (let i = 0; i < game.cells; i++) {
    //     const b = document.createElement("button");
    //     b.id = `cell${i + 1}`;
    //     b.tag = i + 1;
    //     b.className = "cell";
    //     b.textContent = i + 1;
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
    //   divGame.appendChild(divBoard);
    /* END BLOQUE */
  });

  // ACTUALIZA EL JUEGO
  socket.on("update", (game) => {
    //{1: "red", 2: "blue"}
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
}
