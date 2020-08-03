const chai = require("chai");
const chaiHtpp = require("chai-http");
const jwt = require("jsonwebtoken");
let should = chai.should();
const sequelize = require("../sequelize");

let server = require("../index");

const User = require("../models/User");
const Role = require("../models/Role");
const Album = require("../models/Album");

chai.use(chaiHtpp);

let userId;
let adminId;
let userToken;
let adminToken;
let adminRoleId;
let userRoleId;

let userkeys = [
  "id",
  "lastName",
  "firstName",
  "email",
  "password",
  "RoleId",
  "createdAt",
  "updatedAt",
];

describe("USERS", () => {
  before(async () => {
    await sequelize.sync({ force: true });

    const adminRole = await Role.create({ label: "ADMIN" });
    adminRoleId = adminRole.dataValues.id;

    const userRole = await Role.create({ label: "USER" });
    userRoleId = userRole.dataValues.id;

    const admin = await User.create({
      lastName: "JOUARET",
      firstName: "Anais",
      password: "roxane23",
      email: "anais.jouaret@gmail.com",
      RoleId: adminRoleId,
    });
    adminId = admin.dataValues.id;

    adminToken = jwt.sign(
      {
        id: adminId,
        email: admin.dataValues.email,
        role: "ADMIN",
      },
      process.env.SECRET,
      { expiresIn: "3h" }
    );

    const user = await User.create({
      lastName: "Toto",
      firstName: "Jean",
      password: "toto",
      email: "toto@dev.com",
      RoleId: userRoleId,
    });
    userId = user.dataValues.id;

    userToken = jwt.sign(
      {
        id: userId,
        email: user.dataValues.email,
        role: "USER",
      },
      process.env.SECRET,
      { expiresIn: "3h" }
    );
    const albumUser = await Album.create({
      label: "album1",
      date: "25/03/2020",
      UserId: userId,
    });
    albumUserId = albumUser.dataValues.id;

    const albumAdmin = await Album.create({
      label: "album2",
      date: "25/03/2020",
      UserId: adminId,
    });
    albumAdminId = albumAdmin.dataValues.id;
  });

  describe("GET ALL", () => {
    it("admin should success", async () => {
      try {
        const res = await chai
          .request(server)
          .get("/users")
          .set("Authorization", `Bearer ${adminToken}`);
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(2);
      } catch (err) {
        throw err;
      }
    });
    it("user should failed", async () => {
      try {
        const res = await chai
          .request(server)
          .get("/users")
          .set("Authorization", `Bearer ${userToken}`);
        res.should.have.status(403);
        res.body.should.be.a("object");
      } catch (err) {
        throw err;
      }
    });
  });
  describe("GET ONE", () => {
    it("admin should success", async () => {
      try {
        const res = await chai
          .request(server)
          .get(`/users/${adminId}`)
          .set("Authorization", `Bearer ${adminToken}`);
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.keys(userkeys);
      } catch (err) {
        throw err;
      }
    });
    it("admin should success", async () => {
      try {
        const res = await chai
          .request(server)
          .get(`/users/${userId}`)
          .set("Authorization", `Bearer ${adminToken}`);
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.keys(userkeys);
      } catch (err) {
        throw err;
      }
    });
    it("user should success", async () => {
      try {
        const res = await chai
          .request(server)
          .get(`/users/${userId}`)
          .set("Authorization", `Bearer ${userToken}`);
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.keys(userkeys);
      } catch (err) {
        throw err;
      }
    });
    it("user should failed", async () => {
      try {
        const res = await chai
          .request(server)
          .get(`/users/${adminId}`)
          .set("Authorization", `Bearer ${userToken}`);
        res.should.have.status(400);
        res.body.should.be.a("object");
      } catch (err) {
        throw err;
      }
    });
  });
  describe("PUT", () => {
    it("admin should success(admin)", async () => {
      try {
        const res = await chai
          .request(server)
          .put(`/users/${adminId}`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({ firstName: "bonjour" });
        res.should.have.status(202);
        res.body.should.be.a("array");
      } catch (err) {
        throw err;
      }
    });
    it("admin should success (user)", async () => {
      try {
        const res = await chai
          .request(server)
          .put(`/users/${userId}`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({ firstName: "bonjour" });
        res.should.have.status(202);
        res.body.should.be.a("array");
      } catch (err) {
        throw err;
      }
    });
    it("admin should failed", async () => {
      try {
        const res = await chai
          .request(server)
          .put(`/users/${adminId}`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({ hello: "bonjour" });
        res.should.have.status(422);
        res.body.should.be.a("object");
      } catch (err) {
        throw err;
      }
    });
    it("admin should failed", async () => {
      try {
        const res = await chai
          .request(server)
          .put(`/users/${userId}`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({ hello: "bonjour" });
        res.should.have.status(422);
        res.body.should.be.a("object");
      } catch (err) {
        throw err;
      }
    });
    it("user should success", async () => {
      try {
        const res = await chai
          .request(server)
          .put(`/users/${userId}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({ firstName: "bonjour" });
        res.should.have.status(202);
        res.body.should.be.a("array");
      } catch (err) {
        throw err;
      }
    });
    it("user should failed", async () => {
      try {
        const res = await chai
          .request(server)
          .put(`/users/${adminId}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({ firstName: "bonjour" });
        res.should.have.status(422);
        res.body.should.be.a("object");
      } catch (err) {
        throw err;
      }
    });
    it("user should failed (hello)", async () => {
      try {
        const res = await chai
          .request(server)
          .put(`/users/${userId}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({ hello: "bonjour" });
        res.should.have.status(422);
        res.body.should.be.a("object");
      } catch (err) {
        throw err;
      }
    });
  });
  describe("DELETE", () => {
    it("admin should success (user)", async () => {
      try {
        const res = await chai
          .request(server)
          .delete(`/users/${userId}`)
          .set("Authorization", `Bearer ${adminToken}`);
        res.should.have.status(204);
        res.body.should.be.a("object");
      } catch (err) {
        throw err;
      }
    });
    it("admin should success (admin)", async () => {
      try {
        const res = await chai
          .request(server)
          .delete(`/users/${adminId}`)
          .set("Authorization", `Bearer ${adminToken}`);
        res.should.have.status(204);
        res.body.should.be.a("object");
      } catch (err) {
        throw err;
      }
    });
    it("user should success", async () => {
      try {
        const res = await chai
          .request(server)
          .delete(`/users/${userId}`)
          .set("Authorization", `Bearer ${userToken}`);
        res.should.have.status(204);
        res.body.should.be.a("object");
      } catch (err) {
        throw err;
      }
    });
    it("user should failed", async () => {
      try {
        const res = await chai
          .request(server)
          .delete(`/users/${adminId}`)
          .set("Authorization", `Bearer ${userToken}`)
        res.should.have.status(422);
        res.body.should.be.a("object");
      } catch (err) {
        throw err;
      }
    });
  });
  describe("GET", () => {
    it("admin should success", async () => {
      try {
        const res = await chai
          .request(server)
          .get(`/users/${adminId}/albums`)
          .set("Authorization", `Bearer ${adminToken}`);
        res.should.have.status(200);
        res.body.should.be.a("array");
      } catch (err) {
        throw err;
      }
    });
    it("admin should success", async () => {
      try {
        const res = await chai
          .request(server)
          .get(`/users/${userId}/albums`)
          .set("Authorization", `Bearer ${adminToken}`);
        res.should.have.status(200);
        res.body.should.be.a("array");
      } catch (err) {
        throw err;
      }
    });
    it("user should success", async () => {
      try {
        const res = await chai
          .request(server)
          .get(`/users/${userId}/albums`)
          .set("Authorization", `Bearer ${userToken}`);
        res.should.have.status(200);
        res.body.should.be.a("array");
      } catch (err) {
        throw err;
      }
    });
    it("user should failed", async () => {
      try {
        const res = await chai
          .request(server)
          .get(`/users/${adminId}/albums`)
          .set("Authorization", `Bearer ${userToken}`);
        res.should.have.status(400);
        res.body.should.be.a("object");
      } catch (err) {
        throw err;
      }
    });
  });
});
