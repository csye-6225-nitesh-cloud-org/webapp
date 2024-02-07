const dbConfig = require("../config/config.js");
const Sequelize= require("sequelize");


const sequelize = new Sequelize (dbConfig.DB_NAME, dbConfig.DB_USER, dbConfig.DB_PASSWORD,
    {
    host: dbConfig.DB_HOST,
    port: dbConfig.DB_PORT,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
});

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;