const db = require("./db");
const Place = require("./Place");

const seed = async () => {
  await db.sync({ force: true });
  const places = await Promise.all([
    Place.create({ place_name: "NY STATE" }),
    Place.create({ place_name: "NJ STATE" }),
    Place.create({ place_name: "CA STATE" }),
    Place.create({ place_name: "Manhattan", category: "CITY" }),
    Place.create({ place_name: "Brooklyn", category: "CITY" }),
    Place.create({ place_name: "Queens", category: "CITY" }),
    Place.create({ place_name: "Jersey City", category: "CITY" }),
    Place.create({ place_name: "Edison", category: "CITY" }),
    Place.create({ place_name: "New Brunswick", category: "CITY" }),
    Place.create({ place_name: "Los Angeles", category: "CITY" }),
    Place.create({ place_name: "San Francisco", category: "CITY" }),
    Place.create({ place_name: "San Jose", category: "CITY" }),
  ]);

  // Unnecessary - Creating a new object with key value as the place_name, value as the place JSON.
  const placesObj = places.reduce((acc, place) => {
    acc[place.place_name] = place.toJSON();
    return acc;
  }, {});
  console.log("places obj:", placesObj);
};

module.exports = seed;
