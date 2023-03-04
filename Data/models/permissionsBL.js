const jsonDAL = require("../DAL/json");

const getPermissions = async function () // get all permissions from file
{
  let perm = await jsonDAL.getPermissions();

  return perm;
};

const savePermissions = async function (
  id,
  obj // save permissions to file
) {
  let perm = await jsonDAL.getPermissions(); // get all permissions from file

  let data = [];

  if (obj.perm) {
    // edit user
    if (obj.perm.includes("View Subscriptions"))
      // if this permission exist in this user
      data.push("View Subscriptions");

    if (obj.perm.includes("Create Subscriptions"))
      // if this permission exist in this user
      data.push("Create Subscriptions");

    if (obj.perm.includes("Update Subscriptions"))
      // if this permission exist in this user
      data.push("Update Subscriptions");

    if (obj.perm.includes("Delete Subscriptions"))
      // if this permission exist in this user
      data.push("Delete Subscriptions");

    if (obj.perm.includes("View Movies"))
      // if this permission exist in this user
      data.push("View Movies");

    if (obj.perm.includes("Create Movies"))
      // if this permission exist in this user
      data.push("Create Movies");

    if (obj.perm.includes("Update Movies"))
      // if this permission exist in this user
      data.push("Update Movies");

    if (obj.perm.includes("Delete Movies"))
      // if this permission exist in this user
      data.push("Delete Movies");
  } // add user
  else {
    if (obj.VS == true)
      // if this permission exist in this user
      data.push("View Subscriptions");

    if (obj.CS == true)
      // if this permission exist in this user
      data.push("Create Subscriptions");

    if (obj.US == true)
      // if this permission exist in this user
      data.push("Update Subscriptions");

    if (obj.DS == true)
      // if this permission exist in this user
      data.push("Delete Subscriptions");

    if (obj.VM == true)
      // if this permission exist in this user
      data.push("View Movies");

    if (obj.CM == true)
      // if this permission exist in this user
      data.push("Create Movies");

    if (obj.UM == true)
      // if this permission exist in this user
      data.push("Update Movies");

    if (obj.DM == true)
      // if this permission exist in this user
      data.push("Delete Movies");
  }

  let temp = { id: id, permissions: data };

  perm.push(temp);

  await jsonDAL.savePermissions(perm);
};

const deletePermissions = async function (
  id // delete permissions from file
) {
  let perm = await jsonDAL.getPermissions(); // get all permissions

  let all = perm.filter((x) => x.id != id); // //get all permissions from file except the one i need to delete

  await jsonDAL.savePermissions(all);
};

module.exports = { getPermissions, savePermissions, deletePermissions };
