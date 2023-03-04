const moviesDAL = require("../DAL/moviesDAL");
const membersDAL = require("../DAL/membersDAL");
const moviesBL = require("./moviesBL");
const subscriptionsBL = require("./subscriptionsBL");
const membersBL = require("./membersBL");

exports.getData = async function () {
  // get all data from DB
  let movies = await moviesBL.findMovies();
  let members = await membersBL.findMembers();
  const subs = await subscriptionsBL.findSubs();

  if (movies.length > 0) {
    for (let i = 0; i < movies.length; i++) {
      await moviesBL.saveMovies2(movies[i]);
    }
  }
  if (movies.length == 0) {
    // when there isn't data in movies DB
    movies = await moviesDAL.getMovies();

    for (let i = 0; i < movies.length; i++) {
      await moviesBL.saveMovies1(movies[i]);
    }
  }
  if (members.length > 0) {
    for (let i = 0; i < members.length; i++) {
      await membersBL.saveMembers2(members[i]);
    }
  }
  if (members.length == 0) {
    // when there isn't data in members DB
    members = await membersDAL.getMembers();

    for (let i = 0; i < members.length; i++) {
      await membersBL.saveMembers1(members[i]);
    }
  }

  return [movies, members, subs]; // return all data to API
};
