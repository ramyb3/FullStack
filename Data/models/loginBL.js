const dbBL = require("./dbBL");

// check authentication
exports.check = async function (obj) {
  const user = await dbBL.findUser(obj.user);

  if (user.length == 0) {
    // if the name incorrect
    return false;
  } else {
    // if the name correct
    if (obj.psw == user[0].Password) {
      // if the password match the name in DB
      return true;
    } else {
      // if the password not match the name in DB
      return false;
    }
  }
};
