const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../../../models/User");
const Role = require("../../../models/Role");
const { SECRET } = process.env;

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          attributes: ["label"],
        },
      ],
    });

    const isPasswordValid = user.validPassword(password);

    if (user && isPasswordValid) {
      const payload = {
        id: user.dataValues.id,
        email: user.dataValues.email,
        role: user.dataValues.Role.label,
      };
      const token = jwt.sign(payload, SECRET, {
        expiresIn: "24h",
      });
      delete user.dataValues.password;
      res.status(200).json({ token, user });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/register", async (req, res) => {
  const { lastName, firstName, email, password, RoleId } = req.body;
  try {
    const register = await User.create({
      lastName,
      firstName,
      email,
      password,
      RoleId,
    });
    res.status(201).json(register);
  } catch (err) {
    res.status(422).json({ message: "Wrong credencials", error: err.errors });
  }
});

module.exports = router;
