const restDAL = require("../DAL/restDAL");
const moviesBL = require("./moviesBL");
const subscriptionsBL = require("./subscriptionsBL");
const membersBL = require("./membersBL");

// get all data from DB
exports.getData = async function () {
  let movies = await moviesBL.findMovies();
  let members = await membersBL.findMembers();
  const subs = await subscriptionsBL.findSubs();

  if (movies.length > 0) {
    for (let i = 0; i < movies.length; i++) {
      await moviesBL.saveMovies2(movies[i]);
    }
  } else {
    // when there isn't data in movies DB
    movies = await restDAL.getMovies();

    for (let i = 0; i < movies.length; i++) {
      await moviesBL.saveMovies1(movies[i]);
    }
  }

  if (members.length > 0) {
    for (let i = 0; i < members.length; i++) {
      await membersBL.saveMembers2(members[i]);
    }
  } else {
    // when there isn't data in members DB
    members = await restDAL.getMembers();

    for (let i = 0; i < members.length; i++) {
      await membersBL.saveMembers1(members[i]);
    }
  }

  return [movies, members, subs];
};
