const router = require("express").Router();
const {
  db,
  models: { Place },
  seed,
} = require("../db");

// const db = require('../db/db');
// const Place = require('../db/Place');
// const seed = require('../db/seed');

// Add your routes here:
//

// localhost:3000/api/places/api/places/unassigned

// what i like to do is- at the top of every express router file, i say the prefix is `/api/places`

// router.get(); takes two args
// the first arg is `the url`
// the second arg is a callback function

router.get("/unassigned", async (req, res, next) => {
  try {
    res.send(await Place.findCitiesWithNoParent());
  } catch (error) {
    next(error);
  }
});

router.get("/states", async (req, res, next) => {
  try {
    res.send(await Place.findStatesWithCities());
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const place = await Place.findByPk(id);

    // the second you see `Cannot set headers after they are sent to the client` this error, it means "you sent twice!"
    // if (!place) {
    //   res.sendStatus(404);
    // }

    // if it cant find a place, that means place variable is `null`
    // if it breaks on this line, BECAUSE there's an `await` there, it will jump straight to the catch
    await place.destroy();

    // what does 204 mean?
    // btw- do not memorize status codes! just google it when you need it
    // 204 means 'no content'
    res.sendStatus(204);
  } catch {
    next();
  }
});

module.exports = router;
