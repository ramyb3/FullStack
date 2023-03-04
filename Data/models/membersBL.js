const restDAL = require("../DAL/rest");

// get all members from DB
const showAll = async function () {
  const resp = await restDAL.getData();
  return resp[1];
};

// add members to DB
const addMember = async function (member) {
  // if update movie
  let obj = {
    _id: member.id,
    Name: member.name,
    Email: member.email,
    City: member.city,
  };

  // if new member
  if (!member.id) {
    let data = await restDAL.getData();
    data = data[1].map((members) => members._id);
    data = Math.max(...data); // get the last id
    obj._id = data + 1;
  }

  await restDAL.postMembers(obj);
};

// get member that should be updated
const updateMember = async function (obj) {
  let member = await showAll();
  member = member.find((data) => data._id == obj);
  return member;
};

// save update member in DB
const saveUpdate = async function (obj) {
  let member = await showAll();
  member = member.find((data) => data._id == obj.id);
  await deleteMember(member._id);
  await addMember(obj);
};

// delete member in DB
const deleteMember = async function (id) {
  await restDAL.deleteMembers(id);
};

module.exports = { showAll, addMember, updateMember, saveUpdate, deleteMember };
