const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = mongoose.model("User");
// Schema
const gameSchema = new mongoose.Schema(
  {
    cells: {
      type: Number,
      default: 36,
    },
    winner: {
      user: { type: Schema.ObjectId, ref: "User" },
      color: { type: String },
      score: { type: Number },
    },
    looser: {
      user: { type: Schema.ObjectId, ref: "User" },
      color: { type: String },
      score: { type: Number },
    },
    isEqual: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

gameSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// Modelo
const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
