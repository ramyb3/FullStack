const restDAL = require("../DAL/restDAL");
const moviesBL = require("./moviesBL");
const subscriptionsBL = require("./subscriptionsBL");
const membersBL = require("./membersBL");

// get all data from DB
exports.getData = async function () {
  let movies = await moviesBL.getMovies();
  let members = await membersBL.getMembers();
  const subs = await subscriptionsBL.getSubs();

  if (movies.length > 0) {
    await save(movies, moviesBL.saveMovie, true);
  } else {
    // when there isn't data in movies DB
    movies = await restDAL.getMovies();
    await save(movies, moviesBL.saveMovie, false);
  }

  if (members.length > 0) {
    await save(members, membersBL.saveMember, true);
  } else {
    // when there isn't data in members DB
    members = await restDAL.getMembers();
    await save(members, membersBL.saveMember, false);
  }

  return [movies, members, subs];
};

async function save(arr, func, method) {
  for (let i = 0; i < arr.length; i++) {
    await func(arr[i], method);
  }
}
