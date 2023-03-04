const MoviesModel = require("../DAL/moviesModel");

// get all movies in DB
const findMovies = function () {
  return new Promise((resolve, reject) => {
    MoviesModel.find({}, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// save movie in DB if there isn't data before
const saveMovies1 = function (obj) {
  return new Promise((resolve, reject) => {
    const movie = new MoviesModel({
      _id: obj.id,
      Name: obj.name,
      Genres: obj.genres,
      Image: obj.image.medium,
      Premiered: obj.premiered,
    });

    movie.save(function (err) {
      if (err) {
        reject(err);
      }
    });

    resolve(movie);
  });
};

// save movie in DB if there is data before
const saveMovies2 = function (obj) {
  return new Promise((resolve, reject) => {
    const movie = new MoviesModel({
      _id: obj._id,
      Name: obj.Name,
      Genres: obj.Genres,
      Image: obj.Image,
      Premiered: obj.Premiered,
    });

    movie.save(function (err) {
      if (err) {
        reject(err);
      }
    });

    resolve(movie);
  });
};

// delete movie in DB
const deleteMovie = function (id) {
  return new Promise((resolve, reject) => {
    MoviesModel.findOneAndDelete({ _id: id }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = { findMovies, saveMovies1, saveMovies2, deleteMovie };
