const axios = require("axios");

async function getMovies() {
  const resp = await axios.get("https://api.tvmaze.com/shows");
  return resp.data;
}

async function getMembers() {
  const resp = await axios.get("https://jsonplaceholder.typicode.com/users");
  return resp.data;
}

module.exports = { getMovies, getMembers };
