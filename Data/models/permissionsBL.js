const jsonDAL = require("../DAL/json");

// get all permissions from file
const getPermissions = async function () {
  const perm = await jsonDAL.read("permissions");
  return perm;
};

// save permissions to file
const savePermissions = async function (id, obj) {
  const perm = await getPermissions();
  const data = [];

  if ((obj.perm && obj.perm.includes("View Subscriptions")) || obj.VS) {
    data.push("View Subscriptions");
  }
  if ((obj.perm && obj.perm.includes("Create Subscriptions")) || obj.CS) {
    data.push("Create Subscriptions");
  }
  if ((obj.perm && obj.perm.includes("Update Subscriptions")) || obj.US) {
    data.push("Update Subscriptions");
  }
  if ((obj.perm && obj.perm.includes("Delete Subscriptions")) || obj.DS) {
    data.push("Delete Subscriptions");
  }
  if ((obj.perm && obj.perm.includes("View Movies")) || obj.VM) {
    data.push("View Movies");
  }
  if ((obj.perm && obj.perm.includes("Create Movies")) || obj.CM) {
    data.push("Create Movies");
  }
  if ((obj.perm && obj.perm.includes("Update Movies")) || obj.UM) {
    data.push("Update Movies");
  }
  if ((obj.perm && obj.perm.includes("Delete Movies")) || obj.DM) {
    data.push("Delete Movies");
  }

  perm.push({ id, permissions: data });
  await jsonDAL.write(perm, "permissions");
};

// delete permissions from file
const deletePermissions = async function (id) {
  let perm = await getPermissions();
  perm = perm.filter((data) => data.id != id);
  await jsonDAL.write(perm, "permissions");
};

module.exports = { getPermissions, savePermissions, deletePermissions };
