const Sequelize = require("sequelize");

const sequelizeInstance = require("../sequelize");

const Photo = sequelizeInstance.define(
  "Photo",
  {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    url: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    
  },
);

module.exports = Photo;
