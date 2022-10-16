require("dotenv").config();

exports.handler = async function (event, context) {
  console.log(process.env);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: process.env }),
  };
};
