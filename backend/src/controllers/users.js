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
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const USERS = [];
const TOKENS = [];

/* METODO PARA REGISTRAR UN USUARIO */

router.post("/", (req, res) => {
  const { name, email, password, avatar } = req.body;

  if (!name || !email || !password) {
    return res.json({
      ok: false,
      error: "No se han recibido los datos necesarios",
    });
  }
  const hash = bcrypt.hashSync(password, 10);
  //reemplazamos el password con su versión encriptada
  req.body.password = hash;

  const newUser = {
    id: generate_string(),
    name,
    email,
    password: req.body.password,
    avatar,
  };
  USERS.push(newUser);
  console.log("USERS", USERS, USERS.length);
  res.json({ ok: true, data: newUser });
});

/* LOGUEA A UN USUARIO */

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // comprueba que haya correo o pass
  if (!email || !password) {
    return res
      .status(400)
      .json({ ok: false, error: "correo o contraseña no recibidos" });
  }

  const user = USERS.filter((user) => user.email === email);

  if (user.length === 1 && bcrypt.compareSync(password, user[0].password)) {
    const token = generate_string(15);

    const { id, email, name } = user[0];

    const userWithToken = {
      id,
      email,
      name,
      token,
    };

    TOKENS.push(userWithToken);

    res.json({ ok: true, data: userWithToken });
  } else {
    // si no coinciden pasamos msg de error
    res.json({ ok: false, error: "Usuario o Contraseña incorrecta" });
  }
});

/* METODO DELETE PARA HACER LOGOUT */

router.delete("/logout", (req, res) => {
  const { token } = req.body;

  //si no existe el token no aceptamos logout
  if (!token)
    return res.status(400).json({ ok: false, error: "token no recibido" });
  console.log("tokens", TOKENS);
  // si lo recibimos, intentamos eliminarlo
  const index = TOKENS.findIndex((el) => el.token === token);
  TOKENS.splice(index);
  console.log("tokens", TOKENS);
  res.json({ ok: true });
});

/* ACTUALIZA UN USUARIO */

router.put("/:id", (req, res) => {
  const { avatar } = req.body;
  const id = req.params.id;

  const userToUpdate = USERS.filter((user) => user.id === id);

  if (userToUpdate.length === 1) {
    USERS.map((user) => {
      if (user.id === id) {
        return {
          avatar,
          ...user,
        };
      } else {
        user;
      }
    });
    return res.json({ ok: true, data: "Avatar guardado correctamente" });
  } else {
    return res.json({
      ok: false,
      error: `No se ha encontrado ningun usuario con este id ${id}`,
    });
  }
});

/* EXTERNAL FUNCTION PARA GENERAR RANDOMS STRINGS PARA ID's  */
const generate_string = (length = 10) => {
  let id = "";
  const caracteresPossibles =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    id += caracteresPossibles.charAt(
      Math.floor(Math.random() * caracteresPossibles.length)
    );
  }
  return id;
};

//       switch (pathName) {
//         case "/users/get_opponent":
//           console.log("request in route -->", url);
//           try {
//             const { user } = URL.parse(url, true).query;

//             const statusCode = 200;

//             const opponent = getOpponent(user);

//             res.writeHead(statusCode, header);

//             const resBody = {
//               headers,
//               method,
//               url,
//               statusCode,
//               content: opponent,
//             };

//             res.write(JSON.stringify(resBody));
//             res.end();
//           } catch (error) {
//             console.error(error);

//             const statusCode = 500;

//             res.writeHead(statusCode);
//             res.end("Error de servidor");
//           }
//       }
//   }
// };

// // saca un elemeto random del array de los users
// const getOpponent = (nameUser) => {
//   const possiblesOpponents = usersData.filter((el) => el.email !== nameUser);
//   return possiblesOpponents[(Math.random() * possiblesOpponents.length) | 0];
// };

module.exports = router;
