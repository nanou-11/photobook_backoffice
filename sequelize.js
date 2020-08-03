require("dotenv").config();
const Sequelize = require("sequelize");
const { DBNAME, DBPASS, DBUSER, DBDIALECT, DBHOST } = process.env;

if (process.env.DATABASE_URL) {
  module.exports = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
  });
} else {
  module.exports = new Sequelize({
    host: DBHOST || "localhost",
    username: DBUSER,
    password: DBPASS,
    database: DBNAME,
    dialect: DBDIALECT,
  });
}
