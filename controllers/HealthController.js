const db = require('../models/index');

const healthz = async (req, res) => {
    const requestContent = req.headers['content-length'];
    const headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
    };
    try {

        if (parseInt(requestContent) > 0) {
            return res.status(400).header(headers).send();
        }

        if(req.originalUrl.includes('?')) {
            return res.status(400).header(headers).send();
        }
        else {
            await db.sequelize.authenticate();
            res.status(200).header(headers).send()
        }

    } catch (error) {
        res.status(503).header(headers).send();
    }
};

module.exports = { healthz };
