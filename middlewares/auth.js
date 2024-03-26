const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const logger = require("../config/logger")
const authMiddleware = async (req, res, next) =>{
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Basic ")) {
            logger.warn('Missing authorization header')
            return res.status(401).json({
                message: "Missing authorization header"
            });
        }
        const decodedHeader = authHeader.split(" ")[1];
        const userDetails = Buffer.from(decodedHeader, 'base64').toString('utf-8').split(":");
        const username = userDetails[0];
        const password = userDetails[1];
        logger.info(`Authentication request received for user: ${username}`);
        const user = await User.findOne({
            where: {username}
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            logger.warn('Invalid Username or Password in authorization header')
            return res.status(401).json({
                message: "Invalid Username or Password"
            });
        }
        if(!user.email_verified)
        {
            logger.warn(`Email not verified for username : ${user.username}`)
            return res.status(401).json({
                message: "Email not verified "
            });
        }
        logger.info(`User authenticated successfully: ${username}`);
        req.authUser = {
            userId: user.id,
            username: user.username
        };
        next();
    }
    catch (error){
        logger.error(`Error in authentication middleware: ${error.message}`);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = authMiddleware;