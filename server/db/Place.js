const Sequelize = require("sequelize");
const db = require("./db");

// ******************************************

const Place = db.define("place", {
  place_name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  category: {
    type: Sequelize.ENUM("CITY", "STATE", "COUNTRY"),
    defaultValue: "STATE",
    allowNull: false,
  },
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
      return name
        .split(" ")
        .map((word) => word[0].toUpperCase())
        .join("");
    },
    set(newname) {
      this.place_name = newname;
    },
  },
});

// ************************************************* Class Methods

Place.findCitiesWithNoParent = function () {
  return this.findAll({
    where: {
      category: "CITY",
      parentId: null,
    },
  });
};

Place.findStatesWithCities = function () {
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
// ************************************************* Instance Methods
Place.prototype.addParent = function (parentId) {
  this.update({ parentId: parentId });
  return this;
};

Place.belongsTo(Place, { as: "parent" });
Place.hasMany(Place, { as: "children", foreignKey: "parentId" });

module.exports = Place;
