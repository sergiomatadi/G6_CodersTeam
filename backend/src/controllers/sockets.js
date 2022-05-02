const clients = {}; // Objeto con los jugadores conectados
const games = {}; // Objeto con las partidas creadas

let currentGame = [[],[],[],[],[],[]]; //copia ddel estado del tablero
let lastClickPlayer1 = {}; //ultima casilla clicada por el jugador1
let lastClickPlayer2 = {}; //ultima casilla clicada por el jugador2

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
      currentGame = [[],[],[],[],[],[]];
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
      console.log("payload play", payload);
      const { clientId, gameId, cellId, cellX, cellY, color } = payload;
      
  // Se intenta tener unos datos para poder ver si habrá mas casillas disponibles para clickar  
  //Algo no funciona bien.  
  //clientId será para identificar quien ha clickado esa casilla.
  //cellX será para identificar la posicion x de esa casilla (0,1,2,3,4...)
  //cellY será para identifi ar la poisicion y de esa casilla
  // cellx y cellY serán: 0,0 --> para la primera casilla, 0,1--> para la segunda,...

      const cellData = {
        clientId: clientId,
        x: cellX,
        y: cellY
      };
      //ALGO FALLA EN ESTE IF QUE HACE QUE LA APLICACION NO TIRE BIEN
      // La idea es guardar en las lastchild la casilla ultima de cada jugador,
      // que luego se usará en la funcion unableToClickMore para ver las casillas de alrededor 
      // y comprobar si hay alguna que no esté clickada
      if ( lastClickPlayer1 === {} || lastClickPlayer1.clientId === clientId ) { 
        lastClickPlayer1 = {
          clientId: clientId,
          x: cellX,
          y: cellY,
        };
      } else {
        lastClickPlayer2 = {
          clientId: clientId,
          x: cellX,
          y: cellY,
        };
      }
      currentGame[cellX][cellY] = clientId;
      
      //ESTO ES PARA VER EN CONSOLA LOS DATOS QUE HAY 
      socket.emit("updateBoard", currentGame, lastClickPlayer1, lastClickPlayer2);
      
  ///////////////////////   
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
  let game;
  // Itera las keys del objeto games. ej: ['cells', 'players', 'state']
  for (const g of Object.keys(games)) {
    game = games[g];
    game.players.forEach((player) => {
      player.score = game.state && getScore(game.state, player.color);
      const { connection } = clients[player.playerId];
      connection.emit("update", game);
    });
  }

  if (isFinishGame(game.state) || (unableToClickMore(lastClickPlayer1) && unableToClickMore(lastClickPlayer2) )) {
    game.players.forEach((player) => {
      const { connection } = clients[player.playerId];
      connection.emit("finishGame", game.players);
    });
  } else {
    setTimeout(updateGameState, 500);
  }
};

//FUNCION QUE DICTAMINA SI HAY MAS CELDAS A LAS QUE PODER CLICKAR 
function unableToClickMore (player) {
  console.log('ENTRO UNABLE');
  if(Object.keys(player).length === 0) {
    console.log('ENTRO IF');
    return false;
  }
  for(var i=-1; i<=1; i++) {
    for(var j=-1; j<=1; j++) {
      if( (player.x)+i >=0 && (player.y)+j >=0 && (player.x)+i <6 && (player.y)+j <6 && currentGame[(player.x)+i][(player.y)+j] === undefined ) {
        console.log('ENTRO IF2');
        return false;
      }
    }
  }
  console.log('SALGO');
  return true;
};

const isFinishGame = (state) => state && Object.keys(state).length === 36;

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
