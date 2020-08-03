const Sequelize = require("sequelize");

const bcrypt = require("bcrypt");

const sequelizeInstance = require("../sequelize");

const User = sequelizeInstance.define(
  "User",
  {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    lastName: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    firstName: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      },
      beforeUpdate: (user) => {
        if (user.changed("password")) {
          const salt = bcrypt.genSaltSync();
          user.password = bcrypt.hashSync(user.get("password"), salt);
        }
      },
    },
  },
  { defaultScope: { attributes: { exclude: ["password"] } } }
);

User.prototype.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = User;
