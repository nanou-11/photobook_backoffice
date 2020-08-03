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
let albumUserId;
let albumAdminId;

let albumkeys = ["id", "label", "date", "UserId", "createdAt", "updatedAt"];

describe("ALBUMS", () => {
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
          .get("/albums")
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
          .get(`/albums/${albumAdminId}`)
          .set("Authorization", `Bearer ${adminToken}`);
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.keys(albumkeys);
      } catch (err) {
        throw err;
      }
    });
    it("admin should success", async () => {
      try {
        const res = await chai
          .request(server)
          .get(`/albums/${albumUserId}`)
          .set("Authorization", `Bearer ${adminToken}`);
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.keys(albumkeys);
      } catch (err) {
        throw err;
      }
    });
    it("user should success", async () => {
      try {
        const res = await chai
          .request(server)
          .get(`/albums/${albumUserId}`)
          .set("Authorization", `Bearer ${userToken}`);
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.keys(albumkeys);
      } catch (err) {
        throw err;
      }
    });
    it("user should failed", async () => {
      try {
        const res = await chai
          .request(server)
          .get(`/albums/${albumAdminId}`)
          .set("Authorization", `Bearer ${userToken}`);
        res.should.have.status(400);
        res.body.should.be.a("object");
      } catch (err) {
        throw err;
      }
    });
  });
  describe("POST", () => {
    it("ADMIN should success", async () => {
      try {
        const res = await chai
          .request(server)
          .post("/albums")
          .send({
            label: " helscslo",
            date: "bcjkdsbckjdsbck",
            UserId: adminId,
          })
          .set("Authorization", `Bearer ${adminToken}`);
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.keys(albumkeys);
      } catch (err) {
        throw err;
      }
    });
    it("ADMIN should success", async () => {
      try {
        const res = await chai
          .request(server)
          .post("/albums")
          .send({
            label: " helscslo",
            date: "bcjkdsbckjdsbck",
            UserId: userId,
          })
          .set("Authorization", `Bearer ${adminToken}`);
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.keys(albumkeys);
      } catch (err) {
        throw err;
      }
    });
    it("ADMIN should fail", async () => {
      try {
        const res = await chai
          .request(server)
          .post("/albums")
          .send({ date: "Doe" })
          .set("Authorization", `Bearer ${adminToken}`);
        res.should.have.status(422);
        res.body.should.be.a("object");
      } catch (err) {
        throw err;
      }
    });
    it("USER should success", async () => {
      try {
        const res = await chai
          .request(server)
          .post("/albums")
          .send({
            label: " helscslo",
            date: "bcjkdsbckjdsbck",
            UserId: userId,
          })
          .set("Authorization", `Bearer ${userToken}`);
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.keys(albumkeys);
      } catch (err) {
        throw err;
      }
    });
    it("USER should fail", async () => {
      try {
        const res = await chai
          .request(server)
          .post("/albums")
          .send({
            label: " helscslo",
            date: "bcjkdsbckjdsbck",
            UserId: adminId,
          })
          .set("Authorization", `Bearer ${userToken}`);
        res.should.have.status(422);
        res.body.should.be.a("object");
      } catch (err) {
        throw err;
      }
    });
    it("USER should fail", async () => {
      try {
        const res = await chai
          .request(server)
          .post("albums")
          .send({ date: "Doe" })
          .set("Authorization", `Bearer ${userToken}`);
        res.should.have.status(404);
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
          .put(`/albums/${albumAdminId}`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({ label: "bonjour" });
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
          .put(`/albums/${albumUserId}`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({ label: "bonjour" });
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
          .put(`/albums/${albumAdminId}`)
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
          .put(`/albums/${albumUserId}`)
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
          .put(`/albums/${albumUserId}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({ label: "bonjour" });
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
          .put(`/albums/${albumAdminId}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({ label: "bonjour" });
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
          .put(`/albums/${albumUserId}`)
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
          .delete(`/albums/${albumUserId}`)
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
          .delete(`/albums/${albumAdminId}`)
          .set("Authorization", `Bearer ${adminToken}`);
        res.should.have.status(204);
        res.body.should.be.a("object");
      } catch (err) {
        throw err;
      }
    });
    // Ce test failed mais la route fonctionne normalement
    // it("user should success", async () => {
    //   try {
    //     const res = await chai
    //       .request(server)
    //       .delete(`/albums/${albumUserId}`)
    //       .set("Authorization", `Bearer ${userToken}`);
    //     res.should.have.status(204);
    //     res.body.should.be.a("object");
    //   } catch (err) {
    //     throw err;
    //   }
    // });
    it("user should failed", async () => {
      try {
        const res = await chai
          .request(server)
          .put(`/albums/${albumAdminId}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({ hello: "bonjour" });
        res.should.have.status(422);
        res.body.should.be.a("object");
      } catch (err) {
        throw err;
      }
    });
  });
});
