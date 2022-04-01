/**
 * MODULO SALA
 *
 * Cada llamada que se haga a un endpoint con la palabra sala sera redirigida a este modulo
 * este modulo se encaragara de todo lo relacionado con la sala seleccionada por el user
 * jugadores, sala, victoria o derrota, etc..
 *
 * De momento solo acepta metodo POST y GET
 * Las rutas disponibles por ahora son:
 * '/salas/save_game_data'
 */
let salaData;

const salas = async (req, res) => {
  const { headers, method, url } = req;
  const header = {
    "access-control-allow-credentials": true,
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Access-Control-Max-Age": 2592000,
  };

  req.on("error", (err) => {
    console.error(err);
    response.statusCode = 400;
    response.end("BAD REQUEST");
  });
  res.on("error", (err) => {
    console.error(err);
  });

  // Comprobamos el metodo de la solicitud
  switch (method) {
    case "POST":
      // Comprobamos la url de la solicitud
      switch (url) {
        case "/salas/save_game_data":
          console.log("request in route -->", url);
          try {
            salaData = await getData(req);

            const statusCode = 200;

            res.writeHead(statusCode, header);

            const resBody = {
              headers,
              method,
              url,
              statusCode,
            };

            res.write(JSON.stringify(resBody));
            res.end();
          } catch (error) {
            console.error(error);

            const statusCode = 500;

            res.writeHead(statusCode);
            res.end("Error de servidor");
          }
      }
  }
};

// Recibe una request y devuelve el body de la misma
const getData = async (req) => {
  let buffers = [];
  try {
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();
    return JSON.parse(data);
  } catch (error) {
    console.error("Error", error);
  }
};

module.exports = salas;
