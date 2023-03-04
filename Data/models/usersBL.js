const jsonDAL = require("../DAL/json");

//get all users from file
const getUsers = async function () {
  const users = await jsonDAL.getUsers();
  return users;
};

//save user to file
const saveUser = async function (obj) {
  const user = await jsonDAL.getUsers();
  const session = Number(obj.session);

  // if user already exist and has a creation date
  let date = new Date(Date.now());
  date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const data = {
    id: obj.id ? obj.id : user[user.length - 1].id + 1,
    firstName: obj.Fname,
    lastName: obj.Lname,
    createdDate: obj.id ? obj.date : date,
    sessionTimeOut: session,
  };

  user.push(data);
  await jsonDAL.saveUsers(user);

  return data.id;
};

//delete user from file
const deleteUser = async function (id) {
  let user = await jsonDAL.getUsers();
  user = user.filter((data) => data.id != id);
  await jsonDAL.saveUsers(user);
};

module.exports = { getUsers, saveUser, deleteUser };
