const express = require("express");

const router = express.Router();

const Photo = require("../../../models/Photo");
const { validator, photoForPut } = require("../../../middlewares/validator");
const checkJWT = require("../../../middlewares/checkJWT");

router.get("/", checkJWT("ADMIN"), async (req, res) => {
  try {
    const photos = await Photo.findAll();
    res.status(200).json(photos);
  } catch (err) {
    res.status(400).json(err);
  }
});
router.get("/user", checkJWT("ADMIN"), async (req, res) => {
  try {
    const photos = await Photo.findAll({ where: { UserId: req.user.id } });
    res.status(200).json(photos);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id", checkJWT(["ADMIN", "USER"]), async (req, res) => {
  const { id } = req.params;
  try {
    const photoDatas = await Photo.findByPk(id);
    if (photoDatas.UserId === req.user.id) {
      const photo = await Photo.findOne({
        where: { id },
      });
      res.status(200).json(photo);
    } else {
      res.status(422).json(err);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/", checkJWT(["ADMIN", "USER"]), async (req, res) => {
  const { url, AlbumId, UserId } = req.body;
  try {
    if (UserId === req.user.id) {
      const photo = await Photo.create({ url, AlbumId, UserId });
      res.status(201).json(photo);
    } else {
      res.status(422).json(err);
    }
  } catch (err) {
    res.status(422).json({ message: "Wrong credencials", error: err.message });
  }
});

router.put(
  "/:id",
  checkJWT(["ADMIN", "USER"]),
  validator(photoForPut, "body"),
  async (req, res) => {
    const { id } = req.params;
    const { url, AlbumId, UserId } = req.body;
    try {
      if (UserId === req.user.id) {
        const photo = await Photo.update(
          { url, AlbumId, UserId },
          { where: { id } }
        );
        res.status(202).json(photo);
      } else {
        res.status(422).json(err);
      }
    } catch (err) {
      res.status(422).json(err);
    }
  }
);

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (UserId === req.user.id) {
      await Photo.destroy({ where: { id } });
      res.status(204).end();
    } else {
      res.status(422).json(err);
    }
  } catch (err) {
    res.status(422).json(err);
  }
});

module.exports = router;
