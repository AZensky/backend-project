"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GroupMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GroupMember.belongsTo(models.User, {
        foreignKey: "userId",
        as: "Membership",
      });
    }
  }
  GroupMember.init(
    {
      groupId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      status: {
        type: DataTypes.STRING,
        // allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "GroupMember",
    }
  );
  return GroupMember;
};