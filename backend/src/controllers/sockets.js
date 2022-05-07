const clients = {}; // Objeto con los jugadores conectados
const games = {}; // Objeto con las partidas creadas
const Game = require("../models/Game");
module.exports = (io) => {
  // socket connection
  io.on("connection", (socket) => {
    /*
     * Un usuario quiere crear una nueva partida
     */
    socket.on("create", (clientId) => {
      const gameId = guid(); // genera un random id para la nueva partida

      // Crea el objeto game y lo guarda en la constante 'games'
      games[gameId] = {
        id: gameId,
        cells: 36,
        players: [],
      };

      const game = games[gameId];
      // Busca la conexion del usuario que esta creando la partida
      const { connection } = clients[clientId];
      // Devuelve el objeto 'game' al cliente
      connection.emit("create", game);
    });

    /*
     * Un usuario se quiere unir a una partida
     */
    socket.on("join", (payload) => {
      const colors1 = [
        "#8464c6",
        "#3d375e7f",
        "#54c59f",
        "#c7a06f",
        "#c17ac8",
        "#6cb2c7",
      ];

      const colors2 = [
        "#c55858",
        "#a277ff",
        "#61ffca",
        "#f694ff",
        "#82e2ff",
        "#ff6767",
      ];
      const { clientId, gameId, playerInfo } = payload;

      // busca la partida con el id recibido del cliente
      const game = games[gameId];

      if (game?.players?.length >= 2) {
        socket.emit("toMuchPlayers");
        return;
      }
      // asigna un color random al jugador dependiendo de su index en el array
      const color = { 0: getRandomColor(colors1), 1: getRandomColor(colors2) }[
        game?.players?.length
      ];

      // añade un jugador a una partida
      game.players.push({
        playerId: clientId,
        color,
        info: playerInfo,
      });
      if (game.players.length === 1)
        clients[clientId].connection.emit("waitPlayer");

      // empieza el juego cuando hay dos jugadores
      if (game.players.length === 2) {
        game.players.forEach((player) => {
          const { connection } = clients[player.playerId];
          connection.emit("gameStart");
        });

        // Itera cada jugador de la partida para notificar la union de un nuevo jugador
        game.players.forEach((player) => {
          const { connection } = clients[player.playerId];
          connection.emit("join", game);
        });

        updateGameState();
      }
    });

    // Un jugador juega
    socket.on("play", (payload) => {
      const { gameId, cellId, color } = payload;
      /**
       * Añade una propiedad state al objeto game, guardar el id de la casilla y el color
       * ejemplo:
          state: {
            'idCasilla': 'color',
            '7': '#236CF7',
            '10': '#D74CF6',
          }
       */

      let state = games[gameId]?.state;
      if (!state) state = {};

      state[cellId] = color;
      games[gameId].state = state;
    });

    const clientId = guid();

    // Guarda el nuevo cliente con su id en la constante 'clients'
    clients[clientId] = {
      connection: socket,
    };

    const payload = {
      games,
      clientId,
    };
    // Retornamos el userID conectado y las partidas
    socket.emit("connectgame", JSON.stringify(payload));
  });
};

// Envia el estado de la partida actualizado cada 500ms
const updateGameState = () => {
  let game;
  for (const g of Object.keys(games)) {
    game = games[g];

    game.players.forEach((player) => {
      player.score = game.state && getScore(game.state, player.color);
      const { connection } = clients[player.playerId];
      connection.emit("update", game);
    });
  }

  if (isFinishGame(game.state, game.cells)) {
    const { players } = game;
    saveGame(players, game.cells);

    players.forEach((player) => {
      const { connection } = clients[player.playerId];
      connection.emit("finishGame", game.players);
    });
  } else {
    setTimeout(updateGameState, 500);
  }
};

const saveGame = (players, cells) => {
  const winner = getWinner(players[0].score, players[1].score);
  const newFinishedGame = new Game({
    cells,
    winner: {
      user: winner === 1 ? players[0].info.id : players[1].info.id,
      color: winner === 1 ? players[0].info.id : players[1].color,
      score: winner === 1 ? players[0].info.id : players[1].score,
    },
    looser: {
      user: winner === 1 ? players[1].info.id : players[0].info.id,
      color: winner === 1 ? players[1].info.id : players[0].color,
      score: winner === 1 ? players[1].info.id : players[0].score,
    },
    isEqual: winner === 0,
  });
  newFinishedGame.save().then((res) => console.log("GUARDADO", res));
};

const getWinner = (scorePlayer1, scorePlayer2) => {
  const winner =
    scorePlayer1 > scorePlayer2 ? 1 : scorePlayer2 > scorePlayer1 ? 2 : 0;
  return winner;
};

const isFinishGame = (state, cells) =>
  state && Object.keys(state).length === cells;

// DEVUELVE UN COLOR RANDOM DE LOS COLORES QUE RECIBE POR PARAM
const getRandomColor = (colors) => {
  return colors[(Math.random() * colors.length) | 0];
};

// DEVUELVE LA CANTIDAD DE CELDAS CONQUISTADAS
const getScore = (state, color) => {
  const colors = Object.values(state);
  return colors.filter((item) => item === color).length;
};

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

const guid = () =>
  (
    S4() +
    S4() +
    "-" +
    S4() +
    "-4" +
    S4().substr(0, 3) +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  ).toLowerCase();
