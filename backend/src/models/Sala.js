const mongoose = require("mongoose");

// Schema
const salaSchema = new mongoose.Schema({
  salaJugador: Number,
});

// Modelo

const Sala = mongoose.model("Sala", salaSchema);

module.exports = Sala;
