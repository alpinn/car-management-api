"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "created",
      });
      this.belongsTo(models.User, {
        foreignKey: "updatedBy",
        as: "updated",
      });
      this.belongsTo(models.User, {
        foreignKey: "deletedBy",
        as: "deleted",
      });
    }
  }
  Car.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      size: DataTypes.STRING,
      image: DataTypes.STRING,
      available: DataTypes.BOOLEAN,
      createdBy: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
      updatedBy: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
      deletedBy: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Car",
      paranoid: true,
      timestamps: true,
    }
  );
  return Car;
};
