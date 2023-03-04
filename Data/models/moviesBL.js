const restDAL = require("../DAL/rest");

// add movie to DB
const addMovie = async function (movie) {
  // if update movie
  let obj = {
    _id: movie.id,
    Name: movie.name,
    Genres: movie.genres,
    Image: movie.image,
    Premiered: movie.date,
  };

  if (!movie.id) {
    // if new movie
    let data = await restDAL.getData();
    data = data[0].map((movies) => movies._id);
    data = Math.max(...data); // get the last id
    obj._id = data + 1;
  }

  await restDAL.postMovies(obj);
};

// get all movies from DB
const showAll = async function () {
  const resp = await restDAL.getData();
  return resp[0];
};

// search movies in DB
const search = async function (obj) {
  const resp = await restDAL.getData();
  const names = resp[0].map((data) => data.Name);
  const movies = [];

  //check all letters
  for (let i = 0; i < names.length; i++) {
    if (names[i].toLowerCase().includes(obj.toLowerCase())) {
      movies.push(resp[0][i]);
    }
  }

  return movies;
};

// get movie that should be updated
const updateMovie = async function (obj) {
  let movie = await showAll();
  movie = movie.find((data) => data._id == obj);
  return movie;
};

// save update movie in DB
const saveUpdate = async function (obj) {
  let movie = await showAll();
  movie = movie.find((data) => data._id == obj.id);
  await deleteMovie(movie._id);
  await addMovie(obj);
};

// delete movie in DB
const deleteMovie = async function (id) {
  await restDAL.deleteMovies(id);
};

module.exports = {
  addMovie,
  showAll,
  search,
  updateMovie,
  saveUpdate,
  deleteMovie,
};
