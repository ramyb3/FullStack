const MoviesModel = require("../DAL/moviesModel");

// get all movies in DB
const getMovies = function () {
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

// save movie in DB
const saveMovie = function (obj, method) {
  return new Promise((resolve, reject) => {
    const movie = new MoviesModel({
      _id: obj[method ? "_id" : "id"],
      Name: obj[method ? "Name" : "name"],
      Genres: obj[method ? "Genres" : "genres"],
      Image: obj[method ? "Image" : "image.medium"],
      Premiered: obj[method ? "Premiered" : "premiered"],
    });

    movie.save(function (err) {
      if (err) {
        reject(err);
      }
    });

    resolve(movie);
  });
};

// delete movie from DB
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

module.exports = { getMovies, saveMovie, deleteMovie };
