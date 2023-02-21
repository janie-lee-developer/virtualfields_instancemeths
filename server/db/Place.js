const Sequelize = require("sequelize");
const db = require("./db");

// when you create a place item and you dont supply it with a category, it will default to 'STATE'
// await Place.create({ place_name: 'NYC', category: 'COUNTRY' });
const Place = db.define("place", {
  place_name: {
    type: Sequelize.STRING, // can take any string value
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  category: {
    type: Sequelize.ENUM("CITY", "STATE", "COUNTRY"), // can only take a specific set of string values
    defaultValue: "STATE",
    allowNull: false,
  },
  // virtual fields belong in here, but does NOT show up in the database
  isState: {
    type: Sequelize.VIRTUAL,
    get() {
      return this.category === "STATE";
    },
  },
  nickname: {
    type: Sequelize.VIRTUAL,
    get() {
      const name = this.place_name;
      // 1. "new york city"
      // 2. ["new", "york", "city"]
      // this is an array. i want to do something to every single element. which array method should i use?! .map!
      // 3. ['N', 'Y', 'C']
      // 4. 'NYC'
      return name
        .split(" ")
        .map((word) => word[0].toUpperCase())
        .join("");
    },
  },
});

// useful real world example of virtual field

// const User = db.define('user', {
//   firstName: {
//     type: Sequelize.STRING,
//   },
//   lastName: {
//     type: Sequelize.STRING,
//   },
//   fullName: {
//     type: Sequelize.VIRTUAL,
//     get() {
//       return this.firstName + ' ' + this.lastName;
//     },
//   },
// });

/**
 *
 * class method: a function that can only be used on an entire table
 * findAll()
 *
 * instance method: can only be used on a row of that table
 * // thing is an instance of the class
 * const thing = await Thing.findByPk(some id goes in here);
 * await thing.destroy();
 *
 *
 * await Thing.findCitiesWithNoParent();
 */

// how do you make a function in javascript?
// function() {} it binds `this` to `Place`
// const func = () => {} it does not bind `this` to `Place`
Place.findCitiesWithNoParent = function () {
  // find all of the places where category is "CITY" and parentId is null

  return this.findAll({
    where: {
      category: "CITY",
      parentId: null,
    },
  });
};

Place.findStatesWithCities = function () {
  // we want to find all the places whose category is "STATE" AND we want to find all the children of those states
  /**
   *
   * [
   *  { id: 1, place_name: 'staten island', category: 'STATE', parentId: 2, parent: {
   *  id: 2,
   *  place_name: 'the name of the place with id 2',
   * } }
   * ]
   *
   */
  return this.findAll({
    where: {
      category: "STATE",
    },
    include: {
      model: this,
      as: "children",
    },
  });
};

/**
 * We've created the association for you!
 *
 * A place can be related to another place:
 *       NY State (parent)
 *         |
 *       /   \
 *     NYC   Albany
 * (child)  (child)
 *
 * You can find the parent of a place and the children of a place
 */

// this added a `parentId` onto the `Place` table
Place.belongsTo(Place, { as: "parent" });

// since you renamed the foreign key, you have to specify the foreign key in this association
Place.hasMany(Place, { as: "children", foreignKey: "parentId" });

// const nys = await Place.create({ place_name: "NYS",  });

// // this determines that brooklyn is the child, nys is the parent
// const brooklyn = await Place.create({ place_name: "Boston", parentId: nys.id });

module.exports = Place;

// lets say we have two models. User and Thing. it will be a one to many relationship between them

// // it adds a `userId` column onto the `Thing` table
// // given a `Thing`, you are able to find the User that owns it
// Thing.belongsTo(User);
// const thing = await Thing.findAll({
//   include: [{ model: User }],
// });

// // it does NOT add anything onto the database
// // if you have a `User`, you are able to find all the `Thing`s that they own
// User.hasMany(Thing);
// const user = await User.findAll({
//   include: [{ model: Thing }],
// });
