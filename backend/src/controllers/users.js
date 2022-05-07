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

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

const TOKENS = [];

/* REGISTRO DE UN USUARIO */
router.post("/", (req, res) => {
  const { name, email, password, avatar } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({
      ok: false,
      error: "No se han recibido los datos necesarios",
    });
    return;
  }
  const hash = bcrypt.hashSync(password, 10);
  //reemplazamos el password con su versión encriptada
  req.body.password = hash;

  const user = new User({
    name,
    email,
    password: req.body.password,
    avatar,
  });
  user
    .save()
    .then((result) => {
      res.json({ ok: true });
    })
    .catch((err) => {
      res.status(500).json({ ok: false, error: "Error al registrar usuario" });
      console.error("Error al registar usuario", err);
    });
});

//Api Rest GET de jugadores
router.get("/", async (req, res) => {
  const jugadores = await User.find();
  res.json({ data: jugadores });
});

//Api Rest DELETE de jugadores
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  User.deleteOne({id})
    .then(() => {
      res.json({ ok: true, data: "Usuario eliminado correctamente" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        ok: false,
        data: `Error, id recibido mal formado.`,
      });
    });
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

  // Busca user en la bd por el campo email (email es un campo unico)
  User.findOne({ email })
    .then((user) => {
      if (!user)
        return res
          .status(400)
          .json({ ok: false, error: "Usuario no existente!" });
      if (user && bcrypt.compareSync(password, user.password)) {
        res.json({ ok: true, data: user });
      } else {
        res
          .status(400)
          .json({ ok: false, error: "Usuario o Contraseña incorrecta" });
      }
    })
    .catch((err) => {
      console.error("Error buscando usuarios", err);
    });
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
  const { id } = req.params;

  User.findByIdAndUpdate(id, { avatar })
    .then(() => {
      res.json({ ok: true, data: "Avatar guardado correctamente" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).json({
          ok: false,
          data: `Error, id recibido mal formado.`,
        });
      }
      res.status(500).json({
        ok: false,
        data: `Error al actualizar usuario con id ${id}.`,
      });
    });
});

module.exports = router;
