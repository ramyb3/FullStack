const express = require("express");
const router = express.Router();

const moviesBL = require("../models/moviesBL");
const subsBL = require("../models/subscriptionsBL");
const membersBL = require("../models/membersBL");
const funcBL = require("../models/funcBL");

async function returnData() {
  const data = await funcBL.getData();
  return data;
}

//when in login page
router.route("/").get(async function (req, resp) {
  return resp.json(await returnData());
});

//if want to add/edit movie from movies pages
router.route("/movies").post(async function (req, resp) {
  await moviesBL.saveMovie(req.body, true);
  return resp.json(await returnData());
});

//if want to delete movies from movies pages
router.route("/movies/:id").delete(async function (req, resp) {
  await moviesBL.deleteMovie(req.params.id);
  return resp.json(await returnData());
});

//if want to add/edit members from members pages
router.route("/members").post(async function (req, resp) {
  await membersBL.saveMember(req.body, true);
  return resp.json(await returnData());
});

//if want to delete members from members pages
router.route("/members/:id").delete(async function (req, resp) {
  await membersBL.deleteMember(req.params.id);
  return resp.json(await returnData());
});

//if want to add/edit subs from members/movies pages
router.route("/subscriptions").post(async function (req, resp) {
  let array = await subsBL.findSub(Number(req.body.id));

  // when there isn't data in subs DB - add subs
  if (array.length == 0) {
    const data = await subsBL.getSubs();
    let id;

    if (data.length > 0) {
      // if DB isn't empty
      id = data[data.length - 1]._id + 1;
    } else {
      // when there isn't data in subs DB
      id = 1;
    }

    await subsBL.saveSub(req.body, id);
  } else {
    // when there is data in subs DB - edit subs
    await subsBL.updateSub(req.body);
  }

  return resp.json(await returnData());
});

//if want to delete subs from members/movies pages
router.route("/subscriptions/:obj/:id").delete(async function (req, resp) {
  if (req.params.obj == 1) {
    // delete movies
    await subsBL.deleteMoviesSubs(req.params.id);
  }
  if (req.params.obj == 2) {
    // delete members
    await subsBL.deleteMembersSubs(req.params.id);
  }

  return resp.json(await returnData());
});

module.exports = router;
