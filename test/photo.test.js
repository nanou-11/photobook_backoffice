const chai = require("chai");
const chaiHtpp = require("chai-http");
const jwt = require("jsonwebtoken");
let should = chai.should();
const sequelize = require("../sequelize");

let server = require("../index");

const User = require("../models/User");
const Role = require("../models/Role");
const Album = require("../models/Album");
const Photo = require("../models/Photo");

chai.use(chaiHtpp);

let userId;
let adminId;
let userToken;
let adminToken;
let adminRoleId;
let userRoleId;
let albumUserId;
let albumAdminId;
let photoUserId;
let photoAdminId;

let photokeys = ["id", "url", "AlbumId", "UserId", "createdAt", "updatedAt"];

describe("PHOTOS", () => {
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

    const photosUser = await Photo.create({
      url: "bjcdkbvfdjs",
      UserId: userId,
      AlbumId: albumUserId,
    });
    photoUserId = photosUser.dataValues.id;

    const photosAdmin = await Photo.create({
      url: "bjcdkbvfdjs",
      UserId: adminId,
      AlbumId: albumAdminId,
    });
    photoAdminId = photosAdmin.dataValues.id;
  });
  describe("GET ALL", () => {
    it("admin should success", async () => {
      try {
        const res = await chai
          .request(server)
          .get("/photos")
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
          .get("/photos")
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
          .get(`/photos/${photoAdminId}`)
          .set("Authorization", `Bearer ${adminToken}`);
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.keys(photokeys);
      } catch (err) {
        throw err;
      }
    });
    it("admin should success", async () => {
      try {
        const res = await chai
          .request(server)
          .get(`/photos/${photoUserId}`)
          .set("Authorization", `Bearer ${adminToken}`);
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.keys(photokeys);
      } catch (err) {
        throw err;
      }
    });
    it("user should success", async () => {
      try {
        const res = await chai
          .request(server)
          .get(`/photos/${photoUserId}`)
          .set("Authorization", `Bearer ${userToken}`);
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.keys(photokeys);
      } catch (err) {
        throw err;
      }
    });
    it("user should failed", async () => {
      try {
        const res = await chai
          .request(server)
          .get(`/photos/${photoAdminId}`)
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
          .post("/photos")
          .send({
            url: " helscslo",
            AlbumId: albumAdminId,
            UserId: adminId,
          })
          .set("Authorization", `Bearer ${adminToken}`);
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.keys(photokeys);
      } catch (err) {
        throw err;
      }
    });
    it("ADMIN should success (user)", async () => {
      try {
        const res = await chai
          .request(server)
          .post("/photos")
          .send({
            label: "helscslo",
            AlbumId: albumUserId,
            UserId: userId,
          })
          .set("Authorization", `Bearer ${adminToken}`);
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.keys(photokeys);
      } catch (err) {
        throw err;
      }
    });
    it("ADMIN should fail", async () => {
      try {
        const res = await chai
          .request(server)
          .post("/photos")
          .send({ UserId: "Doe" })
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
          .post("/photos")
          .send({
            label: " helscslo",
            AlbumId: albumUserId,
            UserId: userId,
          })
          .set("Authorization", `Bearer ${userToken}`);
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.keys(photokeys);
      } catch (err) {
        throw err;
      }
    });
    it("USER should fail", async () => {
      try {
        const res = await chai
          .request(server)
          .post("/photos")
          .send({
            label: " helscslo",
            AlbumId: albumAdminId,
            UserId: userId,
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
          .post("/photos")
          .send({
            label: " helscslo",
            AlbumId: albumUserId,
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
          .post("/photos")
          .send({ date: "Doe" })
          .set("Authorization", `Bearer ${userToken}`);
        res.should.have.status(422);
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
          .put(`/photos/${photoAdminId}`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({ url: "bonjour" });
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
          .put(`/photos/${photoUserId}`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({ url: "bonjour" });
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
          .put(`/photos/${photoAdminId}`)
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
          .put(`/photos/${photoUserId}`)
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
          .put(`/photos/${photoUserId}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({ url: "bonjour" });
        res.should.have.status(202);
        res.body.should.be.a("array");
      } catch (err) {
        throw err;
      }
    });
    it("user should failed (hello)", async () => {
      try {
        const res = await chai
          .request(server)
          .put(`/photos/${photoUserId}`)
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
          .delete(`/photos/${photoUserId}`)
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
          .delete(`/photos/${photoAdminId}`)
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
          .delete(`/photos/${photoUserId}`)
          .set("Authorization", `Bearer ${userToken}`);
        res.should.have.status(204);
        res.body.should.be.a("object");
      } catch (err) {
        throw err;
      }
    });
  });
});
