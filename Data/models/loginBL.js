const dbBL = require("./dbBL");

exports.check = async function (
  obj // check authentication
) {
  let user = await dbBL.findUser(obj.user); // get user from DB with this specific name

  if (user.length == 0) {
    // if the name incorrect
    return 0;
  } // if the name correct
  else {
    if (obj.psw == user[0].Password) {
      // if the password match the name in DB
      return 1;
    } // if the password not match the name in DB
    else {
      return 0;
    }
  }
};
