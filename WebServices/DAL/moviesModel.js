const mongoose = require("mongoose");

const MoviesSchema = new mongoose.Schema({
  _id: Number,
  Name: String,
  Genres: [String],
  Image: String,
  Premiered: Date,
});

module.exports = mongoose.model("movies", MoviesSchema);
