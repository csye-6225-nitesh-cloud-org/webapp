const winston = require('winston');
const appRoot = require('app-root-path');
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            const logObject = {
                timestamp,
                severity: level.toUpperCase(),
                message
            };
            return JSON.stringify(logObject);
        })

    ),
    transports:[
        new winston.transports.File({filename:`${appRoot}/logs/webapp.log`})
    ]
});
module.exports = logger;