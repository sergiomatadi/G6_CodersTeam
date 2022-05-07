const express = require("express");
const Game = require("../models/Game");
const router = express.Router();

// OBTIENE TODAS LAS PARTIDAS
router.get("/", (req, res) => {
  Game.find()
    .populate("winner.user")
    .populate("looser.user")
    .then((games) => {
      res.json({ ok: true, data: games });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ ok: false, data: err });
    });
});

// OBTIENE TODAS LAS PARTIDAS DE UN USER
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const filter = [{ "winner.user": id }, { "looser.user": id }];
  Game.find({ $or: filter })
    .populate("winner.user")
    .populate("looser.user")
    .then((games) => {
      res.json({ ok: true, data: games });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ ok: false, data: err });
    });
});

// OBTIENE TODAS LAS PARTIDAS GANADAS DE UN USER
router.get("/won/:id", (req, res) => {
  const { id } = req.params;
  const filter = { "winner.user": id };
  Game.find(filter)
    .populate("winner.user")
    .populate("looser.user")
    .then((games) => {
      res.json({ ok: true, data: games });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ ok: false, data: err });
    });
});

// OBTIENE TODAS LAS PARTIDAS PERDIDAS DE UN USER
router.get("/lost/:id", (req, res) => {
  const { id } = req.params;
  const filter = { "looser.user": id };
  Game.find(filter)
    .populate("winner.user")
    .populate("looser.user")
    .then((games) => {
      res.json({ ok: true, data: games });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ ok: false, data: err });
    });
});

router.post("/", async (req, res) => {
  const { cells, winner, looser, isEqual } = req.body;
  console.log(req.body);
  try {
    const finishedGame = new Game({
      cells,
      winner: {
        user: winner.userId,
        color: winner.color,
        score: winner.score,
      },
      looser: {
        user: looser.userId,
        color: looser.color,
        score: looser.score,
      },
      isEqual,
    });

    await finishedGame.save();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, data: err });
  }
});

// ELIMINA UNA PARTIDA JUGADA
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Game.deleteOne({ id })
    .then(() => {
      res.json({ ok: true, data: "Partida eliminada" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ ok: false, data: err });
    });
});

module.exports = router;
