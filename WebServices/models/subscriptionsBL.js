const SubscriptionsModel = require("../DAL/subscriptionsModel");

// get all subs from DB
const findSubs = function () {
  return new Promise((resolve, reject) => {
    SubscriptionsModel.find({}, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// get specific sub by id from DB
const findSub = function (id) {
  return new Promise((resolve, reject) => {
    SubscriptionsModel.find({ MemberId: id }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// save sub to DB if this sub isn't in DB
const saveSubs1 = async function (obj) {
  const data = await findSubs();
  let id;

  if (data.length > 0) {
    // if DB isn't empty
    id = data[data.length - 1]._id + 1;
  } else {
    // when there isn't data in subs DB
    id = 1;
  }

  return new Promise((resolve, reject) => {
    const subs = new SubscriptionsModel({
      _id: id,
      MemberId: obj.id,
      Movies: [{ MovieId: obj.movie, Date: obj.date }],
    });

    subs.save(function (err) {
      if (err) {
        reject(err);
      }
    });

    resolve(subs);
  });
};

// save sub to DB if this sub was in DB
const saveSubs2 = async function (obj) {
  return new Promise((resolve, reject) => {
    const subs = new SubscriptionsModel({
      _id: obj._id,
      MemberId: obj.MemberId,
      Movies: obj.Movies,
    });

    subs.save(function (err) {
      if (err) {
        reject(err);
      }
    });

    resolve(subs);
  });
};

// update sub in DB
const updateSubs = async function (obj) {
  const arr = await findSub(Number(obj.id));
  arr[0].Movies.push({ MovieId: obj.movie, Date: obj.date });

  return new Promise((resolve, reject) => {
    SubscriptionsModel.findOneAndUpdate(
      { _id: arr[0]._id },
      {
        Movies: arr[0].Movies,
      },
      function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};

// delete movies in this sub in DB
const deleteMoviesSubs = async function (id) {
  const data = await findSubs();
  const arr = [];

  for (let i = 0; i < data.length; i++) {
    const movies = data[i].Movies.filter((movie) => movie.MovieId != id);

    //if there's movies after the filter
    if (movies.length != 0) {
      arr.push({
        _id: data[i]._id,
        MemberId: data[i].MemberId,
        Movies: movies,
      });
    }
  }

  return arr;
};

// delete members in this sub in DB
const deleteMembersSubs = async function (id) {
  let arr = await findSubs();
  arr = arr.filter((data) => data.MemberId != id);
  return arr;
};

// delete all subs in DB
const deleteAllSubs = async function () {
  return new Promise((resolve, reject) => {
    SubscriptionsModel.remove({}, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = {
  findSubs,
  findSub,
  saveSubs1,
  saveSubs2,
  updateSubs,
  deleteMoviesSubs,
  deleteMembersSubs,
  deleteAllSubs,
};
