const Sequelize = require("sequelize");

const sequelizeInstance = require("../sequelize");

const Album = sequelizeInstance.define("Album", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  label: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  date: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
});

module.exports = Album;
