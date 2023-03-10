const SubscriptionsModel = require("../DAL/subscriptionsModel");

// get all subs from DB
const getSubs = function () {
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

// save sub to DB
const saveSub = async function (obj, id) {
  return new Promise((resolve, reject) => {
    const subs = new SubscriptionsModel({
      _id: id > 0 ? id : obj._id,
      MemberId: obj[id > 0 ? "id" : "MemberId"],
      Movies: id > 0 ? [{ MovieId: obj.movie, Date: obj.date }] : obj.Movies,
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
const updateSub = async function (obj) {
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

// delete this movie from all subs in DB
const deleteMoviesSubs = async function (id) {
  return new Promise((resolve, reject) => {
    SubscriptionsModel.updateMany(
      { Movies: { $elemMatch: { MovieId: id } } },
      { $pull: { Movies: { MovieId: id } } },
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

// delete this member from subs DB
const deleteMembersSubs = async function (id) {
  return new Promise((resolve, reject) => {
    SubscriptionsModel.deleteOne({ MemberId: id }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = {
  getSubs,
  findSub,
  saveSub,
  updateSub,
  deleteMoviesSubs,
  deleteMembersSubs,
};
