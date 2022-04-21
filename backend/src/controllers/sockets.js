const clients = {}; // Objeto con los jugadores conectados
const games = {}; // Objeto con las partidas creadas

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
        cells: 20,
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
      const { clientId, gameId } = payload;

      // busca la partida con el id recibido del cliente
      const game = games[gameId];

      if (game?.players?.length >= 2) {
        socket.emit("toMuchPlayers");
        return;
      }
      // asigna un color random al jugador dependiendo de su index en el array
      const color = { 0: "#D74CF6", 1: "#236CF7" }[game?.players?.length];

      // añade un jugador a una partida
      game.players.push({
        playerId: clientId,
        color,
      });

      if (game.players.length === 1)
        clients[clientId].connection.emit("waitPlayer");

      // empieza el juego cuando hay dos jugadores
      if (game.players.length === 2) {
        game.players.forEach((player) => {
          const { connection } = clients[player.playerId];
          connection.emit("gameStart");
        });
        updateGameState();
      }

      // Itera cada jugador de la partida para notificar la union de un nuevo jugador
      game.players.forEach((player) => {
        const { connection } = clients[player.playerId];
        connection.emit("join", game);
      });
    });

    // Un jugador juega
    socket.on("play", (payload) => {
      console.log("payload play", payload);
      const { clientId, gameId, cellId, color } = payload;

      /**
       * Añade una state propiedad al objeto game, guardar el id de la casilla y el color
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

      const game = games[gameId];
    });

    // Genera un nuevo id para el nuevo cliente
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

// Envia el stado de la partida actualizado cada 500ms
const updateGameState = () => {
  // Itera las keys del objeto games. ej: ['cells', 'players', 'state']
  for (const g of Object.keys(games)) {
    const game = games[g];

    game.players.forEach((player) => {
      const { connection } = clients[player.playerId];
      connection.emit("update", game);
    });
  }

  setTimeout(updateGameState, 500);
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
