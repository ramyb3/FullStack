const dbBL = require("./dbBL");
const permBL = require("./permissionsBL");
const usersBL = require("./usersBL");

// update user in DB
const update = async function (obj) {
  const id = Number(obj.id);
  let nameData = await dbBL.findAllUsers();
  nameData = nameData.find((data) => data._id == id);

  const newUser = {
    id,
    Fname: obj.Fname,
    Lname: obj.Lname,
    date: obj.date,
    session: obj.session,
  };

  await usersBL.deleteUser(id);
  await usersBL.saveUser(newUser);
  await permBL.deletePermissions(id);
  await permBL.savePermissions(id, obj);
  await dbBL.deleteUserName(id);
  await dbBL.saveUserName(obj.Uname, id);

  // if this user in DB has already password
  if (nameData.Password) {
    nameData = { user: obj.Uname, psw: nameData.Password };
    await dbBL.findAllUsers();
    await dbBL.savePassword(nameData);
  }
};

// get user that should be updated
const edit = async function (id) {
  let user = await usersBL.getUsers();
  let permData = await permBL.getPermissions();
  let nameData = await dbBL.findAllUsers();

  user = user.find((data) => data.id == id);
  permData = permData.find((data) => data.id == id);
  nameData = nameData.find((data) => data._id == id);

  const obj = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    user: nameData.UserName,
    session: user.sessionTimeOut,
    date: user.createdDate,
    perm: permData.permissions,
  };

  return obj;
};

// get all users from DB
const getAll = async function () {
  const users = await usersBL.getUsers();
  const perm = await permBL.getPermissions();
  const userName = await dbBL.findAllUsers();
  const arr = [];

  // get all user data in order
  for (let i = 0; i < users.length; i++) {
    const permData = perm.find((data) => data.id == users[i].id);
    const nameData = userName.find((data) => data._id == users[i].id);
    const name = users[i].firstName + " " + users[i].lastName;

    const obj = {
      id: users[i].id,
      name,
      user: nameData.UserName,
      session: users[i].sessionTimeOut,
      date: users[i].createdDate,
      perm: permData.permissions,
    };

    arr.push(obj);
  }

  return arr;
};

module.exports = { update, edit, getAll };
