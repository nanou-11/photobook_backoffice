const express = require("express");

const router = express.Router();

const User = require("../../../models/User");
const Album = require("../../../models/Album");
const { validator, userForPut } = require("../../../middlewares/validator");
const checkJWT = require("../../../middlewares/checkJWT");

router.get("/", checkJWT("ADMIN"), async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id", checkJWT(["ADMIN", "USER"]), async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.role === "ADMIN" || id === req.user.id) {
      const user = await User.findByPk(id);
      res.status(200).json(user);
    } else {
      res.status(422).json(err);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put(
  "/:id",
  checkJWT(["ADMIN", "USER"]),
  validator(userForPut, "body"),
  async (req, res) => {
    const { id } = req.params;
    const { lastName, firstName, password, email, avatar, RoleId } = req.body;
    try {
      if (req.user.role === "ADMIN" || id === req.user.id) {
        const user = await User.update(
          { lastName, firstName, password, email, avatar, RoleId },
          { where: { id } }
        );
        res.status(202).json(user);
      } else {
        res.status(422).json(err);
      }
    } catch (err) {
      res.status(422).json(err);
    }
  }
);

router.delete("/:id", checkJWT(["ADMIN", "USER"]), async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.role === "ADMIN" || id === req.user.id) {
      await User.destroy({ where: { id } });
      res.status(204).end();
    } else {
      res.status(422).json(err);
    }
  } catch (err) {
    res.status(422).json(err);
  }
});

router.get("/:id/albums", checkJWT(["ADMIN", "USER"]), async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.role === "ADMIN" || id === req.user.id) {
      const albums = await Album.findAll({ where: { UserId: id } });
      res.status(200).json(albums);
    } else {
      res.status(422).json(err);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
