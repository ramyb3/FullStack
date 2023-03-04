const MembersModel = require("../DAL/membersModel");

//get all members from DB
const getMembers = function () {
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

// save member in DB
const saveMember = function (obj, method) {
  return new Promise((resolve, reject) => {
    const member = new MembersModel({
      _id: obj[method ? "_id" : "id"],
      Name: obj[method ? "Name" : "name"],
      Email: obj[method ? "Email" : "email"],
      City: obj[method ? "City" : "address.city"],
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

module.exports = { getMembers, saveMember, deleteMember };
