const axios = require("axios");

const getData = async function () {
  const resp = await axios.get(process.env.SUBSCRIPTION_API_URL);
  return resp.data;
};

const postMovies = async function (obj) {
  await axios.post(`${process.env.SUBSCRIPTION_API_URL}/movies`, obj);
};

const postMembers = async function (obj) {
  await axios.post(`${process.env.SUBSCRIPTION_API_URL}/members`, obj);
};

const postSubs = async function (obj) {
  await axios.post(`${process.env.SUBSCRIPTION_API_URL}/subscriptions`, obj);
};

const deleteMovies = async function (id) {
  await axios.delete(`${process.env.SUBSCRIPTION_API_URL}/movies/${id}`);
};

const deleteMembers = async function (id) {
  await axios.delete(`${process.env.SUBSCRIPTION_API_URL}/members/${id}`);
};

const deleteSubs = async function (obj, id) {
  await axios.delete(
    `${process.env.SUBSCRIPTION_API_URL}/subscriptions/${obj}/${id}`
  );
};

module.exports = {
  getData,
  postMovies,
  postMembers,
  postSubs,
  deleteMovies,
  deleteMembers,
  deleteSubs,
};
