const restDAL = require("../DAL/rest");
const moviesBL = require("./moviesBL");

// assign movie to specific member
const checkMovie = async function (obj) {
  let movie = await moviesBL.showAll();
  movie = movie.find((data) => data.Name == obj.movie);

  obj = { id: obj.id, date: obj.date, movie: movie._id };

  await restDAL.postSubs(obj);
};

// get all subscriptions
const getSubs = async function () {
  const resp = await restDAL.getData();
  return resp[2];
};

// delete specific subscription
const deleteSubs = async function (obj, id) {
  await restDAL.deleteSubs(obj, id);
};

module.exports = { checkMovie, getSubs, deleteSubs };
