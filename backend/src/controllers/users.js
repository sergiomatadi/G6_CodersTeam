/**
 * MODULO USERS
 *
 * Cada llamada que se haga a un endpoint con la palabra users sera redirigidoa este modulo
 * este modulo se encaragara de todo lo relacionado con el usuario
 * registro, login, guardar u obtener info del user, etc..
 *
 * De momento solo acepta metodo POST y GET
 * Las rutas disponibles por ahora son:
 * '/users/register'
 * '/users/login'
 * '/users/save_avatar'
 * '/users/get_opponent'
 */
const URL = require("url");
let usersData = [];
const users = async (req, res) => {
  /**
   * obtenemos lo que nos interesa de la request.
   * headers lo devolvemos en la res,
   * El method para saber si es GET POST, etc
   * url para saber con que metodo responder
   */
  const { headers, method, url } = req;

  const pathName = URL.parse(url, true).pathname; // Obtiene el pathName, es lo que usaremos para comparar cada endpoint
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
      switch (pathName) {
        case "/users/register":
          console.log("request in route -->", url);

          try {
            const data = await getDataFromBody(req);

            usersData = [...usersData, data];

            const statusCode = 200;

            res.writeHead(statusCode, header);

            const resBody = {
              headers,
              method,
              url,
              content: data,
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
          return usersData;

        case "/users/login":
          console.log("request in route -->", url);
          let statusCode;
          try {
            const data = await getDataFromBody(req);

            // Comprueba que exista el usuario en la memoria
            const user = usersData.filter(
              (el) => el.email === data.email && el.password === data.password
            );

            if (user.length > 0) {
              statusCode = 200;
            } else {
              statusCode = 400;
            }

            res.writeHead(statusCode, header);

            const resBody = {
              headers,
              method,
              url,
              content: user[0],
              statusCode,
            };

            res.writeHead(statusCode, header);
            res.write(JSON.stringify(resBody));
            res.end();
          } catch (error) {
            console.error(error);
            const statusCode = 500;
            res.writeHead(statusCode);
            res.end("Error de servidor");
          }
          break;

        case "/users/save_avatar":
          console.log("request in route -->", url);
          try {
            const { avatar } = await getDataFromBody(req);

            // saca el parametro 'user' de la url
            const { user } = URL.parse(url, true).query;

            // Comprueba que exista el usuario en la memoria
            const userObject = usersData.filter((el) => el.email === user);
            let statusCode;

            if (userObject.length > 0) {
              statusCode = 200;
              usersData = usersData.map((el) => {
                if (el.email === user) {
                  return {
                    avatar,
                    ...el,
                  };
                } else {
                  return el;
                }
              });
            } else {
              statusCode = 400;
            }

            res.writeHead(statusCode, header);

            const resBody = {
              headers,
              method,
              url,
              content: user[0],
              statusCode,
            };

            res.writeHead(statusCode, header);
            res.write(JSON.stringify(resBody));
            res.end();
          } catch (error) {
            console.error(error);
            const statusCode = 500;
            res.writeHead(statusCode);
            res.end("Error de servidor");
          }
          break;
        default:
          res.statusCode = 404;
          res.end("not found");
      }
      break;
    case "GET":
      switch (pathName) {
        case "/users/get_opponent":
          console.log("request in route -->", url);
          try {
            const { user } = URL.parse(url, true).query;

            const statusCode = 200;

            const opponent = getOpponent(user);

            res.writeHead(statusCode, header);

            const resBody = {
              headers,
              method,
              url,
              statusCode,
              content: opponent,
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
const getDataFromBody = async (req) => {
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

// saca un elemeto random del array de los users
const getOpponent = (nameUser) => {
  const possiblesOpponents = usersData.filter((el) => el.email !== nameUser);
  return possiblesOpponents[(Math.random() * possiblesOpponents.length) | 0];
};

module.exports = users;
