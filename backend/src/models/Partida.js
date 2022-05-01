const mongoose = require("mongoose");

// Schema
const partidaSchema = new mongoose.Schema({
  clientId: String,
  gameId: String,
  cellId: Number,
  color: String,
});

// Modelo

const Partida = mongoose.model("Partida", partidaSchema);

module.exports = Partida;
