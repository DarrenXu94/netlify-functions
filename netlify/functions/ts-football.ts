import { Handler } from "@netlify/functions";
import axios from "axios";
import { League } from "../../models/football";

async function callAPI() {
  return axios.get<League>("http://api.football-data.org/v4/competitions/PL", {
    headers: {
      "X-Auth-Token": process.env.NETLIFY_FOOTBALL_API_KEY,
    },
  });
}

const handler: Handler = async (event, context) => {
  const res = await callAPI();
  console.log(res);
  return {
    statusCode: 200,
    body: JSON.stringify(res.data),
  };
};

export { handler };
