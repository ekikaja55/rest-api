"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ApiLog extends Model {
    static associate(models) {}
  }
  ApiLog.init(
    {
      api_log_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      pengguna_id: {
        type: DataTypes.BIGINT,
      },
    },
    {
      sequelize,
      modelName: "api_log",
      tableName: "api_log",
      paranoid: true,
      name: {
        singular: "ApiLog",
        plural: "ApiLog",
      },
    }
  );
  return ApiLog;
};
