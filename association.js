const User = require("./models/User");
const Photo = require("./models/Photo");
const Album = require("./models/Album");
const Role = require("./models/Role");

User.hasMany(Album);
Album.belongsTo(User, { foreignKey: { allowNull: true }, onDelete: "CASCADE" });

User.hasMany(Photo);
Photo.belongsTo(User, { foreignKey: { allowNull: true }, onDelete: "CASCADE" });

Album.hasMany(Photo);
Photo.belongsTo(Album, {
  foreignKey: { allowNull: true },
  onDelete: "CASCADE",
});

User.belongsTo(Role, { foreignKey: { allowNull: true } });
Role.hasMany(User);
