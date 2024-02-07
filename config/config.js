require("dotenv").config();
module.exports = {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME : process.env.DB_NAME,
    dialect : "postgres",
    DB_PORT: process.env.DB_PORT || 5432,
    PORT: process.env.PORT,
    HOSTNAME:  process.env.HOSTNAME,
}
