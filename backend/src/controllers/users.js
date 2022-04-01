/**
 * MODULO USERS
 *
 * Cada llamada que se haga a un endpoint con la palabra users sera redirigidoa este modulo
 * este modulo se encaragara de todo lo relacionado con el usuario
 * registro, login, guardar u obtener info del user, etc..
 *
 * De momento solo acepta metodo POST para registrarse y loguearse
 * Las rutas disponibles por ahora son:
 * '/users/register'
 * '/users/login'
 */

let usersData = [
  { user: "edwin", email: "edwin@mail.com", password: "1234" },
  { user: "Luis", email: "luis@correo.com", password: "1234" },
];
const users = async (req, res) => {
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
        case "/users/register":
          console.log("request in route -->", url);
          let buffers = [];
          try {
            // Lee los datos de la solicitud
            for await (const chunk of req) {
              buffers.push(chunk);
            }
            const data = Buffer.concat(buffers).toString();

            usersData = [...usersData, JSON.parse(data)];

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
          console.log("users", usersData);
          return usersData;

        case "/users/login":
          console.log("request in route -->", url);
          let statusCode;
          try {
            let buffers = [];
            for await (const chuk of req) {
              buffers.push(chuk);
            }
            const dataToParse = Buffer.concat(buffers).toString();

            const data = JSON.parse(dataToParse);

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
            console.log("users", user[0]);

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
  }
};

module.exports = users;
