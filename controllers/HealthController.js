const db = require('../models/index');
const logger = require("../config/logger")
const healthz = async (req, res) => {
    const requestContent = req.headers['content-length'];
    const headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
    };
    try {
        logger.info('Health check endpoint accessed');
        if (parseInt(requestContent) > 0) {
            logger.warn('Invalid request: Content-Length is greater than 0');
            return res.status(400).header(headers).send();
        }

        if(req.originalUrl.includes('?')) {
            logger.warn('Invalid request: Query parameters are not allowed');
            return res.status(400).header(headers).send();
        }
        else {
            await db.sequelize.authenticate();
            logger.info('Database connection successful');
            res.status(200).header(headers).send()
        }

    } catch (error) {
        logger.error('Health check failed:', error);
        res.status(503).header(headers).send();
    }
};

module.exports = { healthz };
