const axios = require("axios");
require("dotenv").config();

async function callAPI() {
  return axios.get("http://api.football-data.org/v4/competitions/PL", {
    headers: {
      "X-Auth-Token": process.env.NETLIFY_FOOTBALL_API_KEY,
    },
  });
}
exports.handler = async function (event, context) {
  const res = await callAPI();
  console.log(res);
  return {
    statusCode: 200,
    body: JSON.stringify(res.data),
  };
};
