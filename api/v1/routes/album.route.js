const express = require("express");
const checkJWT = require("../../../middlewares/checkJWT");
const router = express.Router();

const Album = require("../../../models/Album");
const Photo = require("../../../models/Photo");
const { validator, albumForPut } = require("../../../middlewares/validator");

router.get("/", checkJWT("ADMIN"), async (req, res) => {
  try {
    const albums = await Album.findAll();
    res.status(200).json(albums);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id", checkJWT(["ADMIN", "USER"]), async (req, res) => {
  const { id } = req.params;
  try {
    const albumUser = await Album.findByPk(id);
    if (req.user.role === "ADMIN" || albumUser.UserId === req.user.id) {
      const album = await Album.findByPk(id);
      res.status(200).json(album);
    } else {
      res.status(400).json(err);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/", checkJWT(["ADMIN", "USER"]), async (req, res) => {
  const { label, date, UserId } = req.body;
  try {
    if (req.user.role === "ADMIN" || UserId === req.user.id) {
      const album = await Album.create({ label, date, UserId });
      res.status(201).json(album);
    } else {
      res.status(422).json({ message: "Wrong credencials", error: err.errors });
    }
  } catch (err) {
    res.status(422).json({ message: "Wrong credencials", error: err.errors });
  }
});

router.put(
  "/:id",
  checkJWT(["ADMIN", "USER"]),
  validator(albumForPut, "body"),
  async (req, res) => {
    const { id } = req.params;
    const { label, date, UserId } = req.body;
    try {
      const albumUser = await Album.findByPk(id);
      if (
        req.user.role === "ADMIN" ||
        albumUser.dataValues.UserId === req.user.id
      ) {
        const album = await Album.update(
          { label, date, UserId },
          { where: { id } }
        );
        res.status(202).json(album);
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
    const albumUser = await Album.findByPk(id);
    if (
      req.user.role === "ADMIN" ||
      albumUser.dataValues.UserId === req.user.id
    ) {
      await Album.destroy({ where: { id } });
      res.status(204).end();
    } else {
      res.status(422).json(err);
    }
  } catch (err) {
    res.status(422).json(err);
  }
});

router.get("/:id/photos", checkJWT(["ADMIN", "USER"]), async (req, res) => {
  const { id } = req.params;
  try {
    const albumUser = await Album.findByPk(id);
    if (
      req.user.role === "ADMIN" ||
      albumUser.dataValues.UserId === req.user.id
    ) {
      const photos = await Photo.findAll({ where: { AlbumId: id } });
      res.status(200).json(photos);
    } else {
      res.status(400).json(err);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
