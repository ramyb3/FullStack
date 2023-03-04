const MembersModel = require("../DAL/membersModel");

//get all members from DB
const findMembers = function () {
  return new Promise((resolve, reject) => {
    MembersModel.find({}, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// save member in DB if there isn't data before
const saveMembers1 = function (obj) {
  return new Promise((resolve, reject) => {
    const member = new MembersModel({
      _id: obj.id,
      Name: obj.name,
      Email: obj.email,
      City: obj.address.city,
    });

    member.save(function (err) {
      if (err) {
        reject(err);
      }
    });

    resolve(member);
  });
};

// save member in DB if there is data before
const saveMembers2 = function (obj) {
  return new Promise((resolve, reject) => {
    const member = new MembersModel({
      _id: obj._id,
      Name: obj.Name,
      Email: obj.Email,
      City: obj.City,
    });

    member.save(function (err) {
      if (err) {
        reject(err);
      }
    });

    resolve(member);
  });
};

// delete member in DB
const deleteMember = function (id) {
  return new Promise((resolve, reject) => {
    MembersModel.findOneAndDelete({ _id: id }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = { findMembers, saveMembers1, saveMembers2, deleteMember };
