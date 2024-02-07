const config = require("./config/config.js");
const express = require('express');
const routes = require("./routes/index");


const app = express();
const PORT = config.PORT;
const HOSTNAME = config.HOSTNAME;
app.use(express.json());
app.use("/", routes.health);
app.use("/v1", routes.user);

app.use('*',(req,res)=>{
res.status(404).send();
});

module.exports = app;