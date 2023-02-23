const router = require("express").Router();
const {
  models: { Place },
} = require("../db");

// localhost:3000/api/places/unassigned
router.get("/unassigned", async (req, res, next) => {
  try {
    res.send(await Place.findCitiesWithNoParent());
  } catch (error) {
    next(error);
  }
});

// localhost:3000/api/places/states
router.get("/states", async (req, res, next) => {
  try {
    res.send(await Place.findStatesWithCities());
  } catch (error) {
    next(error);
  }
});

// localhost:3000/api/places/1/newname
router.get("/:id/:new_name", async (req, res, next) => {
  try {
    const place = await Place.findByPk(req.params.id);

    console.log("place_name is ", place.place_name); // stored in DB
    console.log("nickname is ", place.nickname); //Not stored in DB but stored in virtual field by Sequelize

    const anotherplace = Place.build({
      place_name: "San Diego",
      category: "City",
      nickname: req.params.new_name, //when build, sequelize automatically calls setter() method for nickname.
    }); //Not stored in DB until save() invoked. Sequelize storing the instance.

    res.send(`
        ${place.place_name},
        ${place.nickname},
        ${anotherplace.nickname}
    `);
  } catch (error) {
    next(error);
  }
});

// localhost:3000/api/places/addparent/2/1
router.get("/addparent/:child_id/:parent_id", async (req, res, next) => {
  try {
    const place = await Place.findByPk(req.params.child_id); //SanJose

    res.send(place.addParent(req.params.parent_id));
  } catch (error) {
    next(error);
  }
});

// localhost:3000/api/places/1
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const place = await Place.findByPk(id);
    await place.destroy();
    // 204 means 'no content'
    res.sendStatus(204);
  } catch {
    next();
  }
});

module.exports = router;
