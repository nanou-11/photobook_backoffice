require("dotenv").config();
const express = require("express");
const cors = require("cors");

const sequelize = require("./sequelize");
require("./association");

const port = process.env.PORT || 8000;
const User = require("./models/User");
const Role = require("./models/Role");

const users = require("./api/v1/routes/user.route");
const auth = require("./api/v1/routes/auth.route");
const album = require("./api/v1/routes/album.route");
const photo = require("./api/v1/routes/photo.route");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", users);
app.use("/auth", auth);
app.use("/albums", album);
app.use("/photos", photo);

app.get("/", (req, res) => {
  res.status(200).send("Bienvenue sur l'API d'ImagyBook");
});

sequelize
  .sync()
  .then(() => {
    return sequelize.authenticate();
  })
  .then(() => {
    // we create two roles only if they don't exists
    return Promise.all([
      Role.findCreateFind({ where: { label: "ADMIN" } }),
      Role.findCreateFind({ where: { label: "USER" } }),
    ]);
  })
  .then(([admin, user]) => {
    // then we create two users for testing
    return Promise.all([
      User.findCreateFind({
        where: { email: "anais@dev.com" },
        defaults: {
          password: "anais",
          firstName: "anais",
          lastName: "anais",
          RoleId: admin[0].id,
        },
      }),
    ]);
  })
  .then(() => {
    app.listen(port, (err) => {
      if (err) {
        throw new Error("Something really bad happened ...");
      }
      console.log(`Server is listening on ${port}`);
    });
  })
  .catch((err) => {
    console.log("unable to join database", err.message);
  });

module.exports = app;
