const winston = require('winston');
const logFilePath = process.env.LOG_FILE_PATH || `/var/log/webapp/webapp.log`;
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
        new winston.transports.File({filename:logFilePath})
    ]
});
module.exports = logger;