const UsersModel = require("../DAL/usersModel");

// get all users from DB
const getUsers = function () {
  return new Promise((resolve, reject) => {
    UsersModel.find({}, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// get user from DB by name
const findUser = function (name) {
  return new Promise((resolve, reject) => {
    UsersModel.find({ UserName: name }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// save password to exist user in DB
const savePassword = function (obj) {
  return new Promise((resolve, reject) => {
    UsersModel.findOneAndUpdate(
      { UserName: obj.user },
      {
        UserName: obj.user,
        Password: obj.psw,
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

// save name to new user in DB
const saveUserName = function (Uname, id) {
  return new Promise((resolve, reject) => {
    const user = new UsersModel({
      _id: id,
      UserName: Uname,
    });

    user.save(function (err) {
      if (err) {
        reject(err);
      }
    });

    resolve(user);
  });
};

// delete user by id from DB
const deleteUserName = function (id) {
  return new Promise((resolve, reject) => {
    UsersModel.findOneAndDelete({ _id: id }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = {
  getUsers,
  findUser,
  savePassword,
  saveUserName,
  deleteUserName,
};
