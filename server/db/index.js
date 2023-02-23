const db = require("./db");
const Place = require("./Place");
const seed = require("./seed");

module.exports = {
  db,
  seed,
  models: {
    Place,
  },
};
