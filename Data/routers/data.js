const express = require("express");
const router = express.Router();

const usersBL = require("../models/usersBL");
const loginBL = require("../models/loginBL");
const permBL = require("../models/permissionsBL");
const dbBL = require("../models/dbBL");
const funcBL = require("../models/funcBL");
const moviesBL = require("../models/moviesBL");
const subsBL = require("../models/subsBL");
const membersBL = require("../models/membersBL");
const restDAL = require("../DAL/rest");

router.route("/").get(async function (req, resp) {
  const array = await restDAL.getData();
  return resp.json(array);
});

router.route("/main").post(async function (req, resp) {
  const check = await loginBL.check(req.body); // check authentication

  if (check == 1) {
    // if user authenticated
    const time = Date.now();

    //get all data of logged user
    const user = await dbBL.findUser(req.body.user);
    let perm = await permBL.getPermissions();
    const users = await usersBL.getUsers();

    perm = perm.find((data) => data.id == user[0]._id).permissions;

    // 1 minute = 60000 Milliseconds
    const timeOut =
      users.find((data) => data.id == user[0]._id).sessionTimeOut * 60000;

    return resp.json({
      name: req.body.user,
      perm,
      time,
      timeOut,
    });
  }
  if (check == 0) {
    // if not authenticated
    return resp.json("THE USERNAME OR PASSWORD IS INCORRECT!!");
  }
});

//need to check this
router.route("/create").post(async function (req, resp) {
  const data = await dbBL.findUser(req.body.user);

  if (data.length == 0) {
    return resp.json("THIS USER DOES NOT EXIST!!");
  } else {
    let check = false;

    if (!data[0].Password) {
      // check if user don't have a password
      await dbBL.savePassword(req.body);

      check = true;
    }

    if (data[0].Password && !check) {
      // check if user already created and has a password
      return resp.json("THIS USER ALREADY HAS PASSWORD!!");
    } else {
      const array = await restDAL.getData();
      return resp.json(array);
    }
  }
});

router.route("/users").get(async function (req, resp) {
  const array = await funcBL.getAll();
  return resp.json(array);
});

router.route("/addUser").post(async function (req, resp) {
  let data = await usersBL.saveUser(req.body); // save user in file
  await permBL.savePermissions(data, req.body); // save permission in file
  await dbBL.saveUserName(req.body.Uname, data); // save user in DB

  data = await restDAL.getData();
  return resp.json(data);
});

router.route("/editUser/:id").get(async function (req, resp) {
  const data = await funcBL.edit(req.params.id); // get user that i want to update
  return resp.json(data);
});

router.route("/updateUser").post(async function (req, resp) {
  await funcBL.update(req.body); // update new data of specific user

  const array = await restDAL.getData();
  return resp.json(array);
});

router.route("/deleteUser/:id").delete(async function (req, resp) {
  // delete user data from all files and DB
  await dbBL.deleteUserName(req.params.id);
  await usersBL.deleteUser(req.params.id);
  await permBL.deletePermissions(req.params.id);

  const array = await restDAL.getData();
  return resp.json(array);
});

router.route("/findMovies/:movie").post(async function (req, resp) {
  // get all search data
  const movies = await moviesBL.search(req.params.movie);
  const subs = await subsBL.getSubs();
  const members = await membersBL.showAll();

  return resp.json([movies, members, subs]);
});

router.route("/movies/:id").get(async function (req, resp) {
  const movies = await moviesBL.showAll();
  const subs = await subsBL.getSubs();
  const members = await membersBL.showAll();
  const movie = movies.find((data) => data._id == req.params.id);
  const sub = [];

  for (let i = 0; i < subs.length; i++) {
    for (let j = 0; j < subs[i].Movies.length; j++) {
      if (subs[i].Movies[j].MovieId == movie._id) {
        sub.push({
          member: members.find((data) => data._id == subs[i].MemberId),
          date: subs[i].Movies[j].Date,
        });
      }
    }
  }

  return resp.json([sub, movie]);
});

router.route("/addMovie").post(async function (req, resp) {
  await moviesBL.addMovie(req.body); // add this movie to DB

  const array = await restDAL.getData();
  return resp.json(array);
});

router.route("/editMovie/:id").get(async function (req, resp) {
  const movie = await moviesBL.updateMovie(req.params.id); // get data of movie that should be updated
  const date = movie.Premiered.slice(0, 10); // get full premiere date
  return resp.json([movie, date]);
});

router.route("/updateMovie").post(async function (req, resp) {
  await moviesBL.saveUpdate(req.body); // update this movie

  const array = await restDAL.getData();
  return resp.json(array);
});

router.route("/deleteMovie/:id").delete(async function (req, resp) {
  await moviesBL.deleteMovie(req.params.id); // delete this movie
  await subsBL.deleteSubs(1, req.params.id); // delete all subs that assigned to this movie

  const array = await restDAL.getData();
  return resp.json(array);
});

router.route("/subscriptions/:id").get(async function (req, resp) {
  const movies = await moviesBL.showAll();
  const subs = await subsBL.getSubs();
  const members = await membersBL.showAll();
  const member = members.find((data) => data._id == req.params.id);
  const sub = subs.find((data) => data.MemberId == req.params.id);
  const arr = [];

  for (let i = 0; i < sub.Movies.length; i++) {
    arr.push(sub.Movies[i].MovieId);
  }

  const list = movies.filter((data) => !arr.includes(data._id));

  return resp.json([sub.Movies, member, movies, list]);
});

router.route("/addMember").post(async function (req, resp) {
  await membersBL.addMember(req.body); // add this member to DB

  const array = await restDAL.getData();
  return resp.json(array);
});

router.route("/editMember/:id").get(async function (req, resp) {
  const member = await membersBL.updateMember(req.params.id); // get data of member that should be updated
  return resp.json(member);
});

router.route("/updateMember").post(async function (req, resp) {
  await membersBL.saveUpdate(req.body); // update this member

  const array = await restDAL.getData();
  return resp.json(array);
});

router.route("/deleteMember/:id").delete(async function (req, resp) {
  await membersBL.deleteMember(req.params.id); // delete this member from DB
  await subsBL.deleteSubs(2, req.params.id); // delete this member subs from DB

  const array = await restDAL.getData();
  return resp.json(array);
});


router.route("/addSubs").post(async function (req, resp) {
  await subsBL.checkMovie(req.body); // assign this movie to specific this member

  const array = await restDAL.getData();
  return resp.json(array);
});

module.exports = router;
