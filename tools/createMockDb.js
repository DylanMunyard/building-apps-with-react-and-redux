/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

/* mockData is declared as const mainData = { }. In the body paste the full API
   response from /api/v2/sync/maindata. Export using this code:
   // Using CommonJS style export so we can consume via Node (without using Babel-node)
  module.exports = {
    mainData
  };
*/ 
const mockData = require("./mockData");

const { mainData, preferences } = mockData;
const data = JSON.stringify({mainData, preferences});
const filepath = path.join(__dirname, "db.json");

fs.writeFile(filepath, data, function(err) {
  err ? console.log(err) : console.log("Mock DB created.");
});
