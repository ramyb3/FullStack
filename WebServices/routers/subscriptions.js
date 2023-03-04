const express = require("express");
const router = express.Router();

const moviesBL = require("../models/moviesBL");
const subsBL = require("../models/subscriptionsBL");
const membersBL = require("../models/membersBL");
const funcBL = require("../models/funcBL");

//when in login page
router.route("/").get(async function (req, resp) {
  const array = await funcBL.getData();
  return resp.json(array);
});

//if want to add/edit movie from movies pages
router.route("/movies").post(async function (req, resp) {
  await moviesBL.saveMovies2(req.body);

  const array = await funcBL.getData();
  return resp.json(array);
});

//if want to delete movies from movies pages
router.route("/movies/:id").delete(async function (req, resp) {
  await moviesBL.deleteMovie(req.params.id);

  const array = await funcBL.getData();
  return resp.json(array);
});

//if want to add/edit members from members pages
router.route("/members").post(async function (req, resp) {
  await membersBL.saveMembers2(req.body);

  const array = await funcBL.getData();
  return resp.json(array);
});

//if want to delete members from members pages
router.route("/members/:id").delete(async function (req, resp) {
  await membersBL.deleteMember(req.params.id);

  const array = await funcBL.getData();
  return resp.json(array);
});

//if want to add/edit subs from members/movies pages
router.route("/subscriptions").post(async function (req, resp) {
  let array = await subsBL.findSub(Number(req.body.id));

  if (array.length == 0) {
    // when there isn't data in subs DB - add subs
    await subsBL.saveSubs1(req.body);
  } else {
    // when there is data in subs DB - edit subs
    await subsBL.updateSubs(req.body);
  }

  array = await funcBL.getData();
  return resp.json(array);
});

//if want to delete subs from members/movies pages
router.route("/subscriptions/:obj/:id").delete(async function (req, resp) {
  let array;

  if (req.params.obj == 1) {
    // delete movies
    array = await subsBL.deleteMoviesSubs(req.params.id);
  }
  if (req.params.obj == 2) {
    // delete members
    array = await subsBL.deleteMembersSubs(req.params.id);
  }

  await subsBL.deleteAllSubs(); // delete all data from subs DB

  // save new data to subs DB
  for (let i = 0; i < array.length; i++) {
    await subsBL.saveSubs2(array[i]);
  }

  array = await funcBL.getData();
  return resp.json(array);
});

module.exports = router;
