const db = require("./models");
const app = require("./app");
const config = require("./config/config.js");


const PORT = config.PORT;
const HOSTNAME = config.HOSTNAME;

app.listen(PORT, async () => {
    try {
        await db.sequelize.authenticate();
        await db.sequelize.sync()
        console.log('Database connected successfully.');
        console.log(`Server is running on http://${HOSTNAME}:${PORT}`);
    } catch (error) {
        console.error('Error during server startup:', error);
    }
})