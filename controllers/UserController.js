const User = require("../models/user.model");
const EmailLog = require("../models/EmailLog.model")
const bcrypt = require('bcrypt');
const logger = require("../config/logger")
const uuid = require('uuid');
const { PubSub } = require('@google-cloud/pubsub');
const {Op} = require("sequelize");
const config = require("../config/config");


const createUser = async (req, res) => {

    const {method, protocol, hostname, originalUrl} = req;
    logger.info(`Requested:${method} ${protocol}://${hostname}${originalUrl}`);
    const {first_name, last_name, password, username, ...unwantedFields} = req.body;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

    if (req.originalUrl.includes('?')) {
        logger.warn('Request Failed: Query parameters are not allowed');
        return res.status(400).send();
    }
    if (Object.keys(unwantedFields).length > 0) {
        logger.warn('Request Failed: unwanted fields');
        return res.status(400).json({
            message: "Invalid request body: contains unwanted fields."
        })
    }
    if (!first_name || !last_name || !password || !username) {
        logger.warn('Request Failed: Invalid Request Body');
        return res.status(400).json({
            message: "Invalid Request Body"
        });
    }
    if (typeof first_name !== 'string' || typeof last_name !== 'string' || typeof password !== 'string') {
        logger.warn('Request Failed: Name and Password must be String');
        return res.status(400).json({
            message: "Name and Password must be String"
        });
    }
    if (password.length <= 5) {
        logger.warn('Request Failed: Password criteria failed');
        return res.status(400).json({
            message: "Minimum Password Length is 6 char"
        });
    }
    if (!emailRegex.test(username)) {
        logger.warn('Request Failed: Invalid mail detected');
        return res.status(400).json({
            message: "Invalid Email Format"
        });
    }
    if (req.body.id || req.body.createdAt || req.body.updatedAt) {
        logger.warn('Request Failed: Id, CreatedAT or updatedAt detected');
        return res.status(400).json({
            message: "Invalid Request Body"
        });
    }
    try {
        const existingUser = await User.findOne({
            where: {
                username: username
            }
        });
        if (existingUser) {
            logger.warn('Request Failed: Username Already Exists');
            return res.status(409).json({
                message: "Username already exists"
            });
        }
        const topic = config.PUB_SUB_TOPIC;
        const pubsub = new PubSub({
            projectId :config.GCP_PROJECT_ID
        });
        const verificationToken = uuid.v4();
        const verificationTokenExpires = new Date(Date.now() + 120000);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            first_name,
            last_name,
            username,
            password: hashedPassword,
            verification_token: verificationToken,
            verification_token_expires: verificationTokenExpires,
        });
        const messagePayload = {
            firstName: newUser.first_name,
            lastName: newUser.last_name,
            username: newUser.username,
            verificationToken: verificationToken,
            verificationTokenExpires: verificationTokenExpires.toISOString(),
        }
        try {
            const messageId = await pubsub.topic(topic).publishMessage({data: Buffer.from(JSON.stringify(messagePayload))});
            logger.info(`Message ${messageId} published to topic ${topic}`);
        }
        catch (err)
        {
            logger.warn(`Failed to publish Message to topic ${topic}`);
        }
        res.status(201).json({
            id: newUser.id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            username: newUser.username,
            account_created: newUser.account_created,
            account_updated: newUser.account_updated
        });
        logger.info(`User created, username : ${newUser.username} `);
    } catch (err) {
        logger.error(`Error creating user: ${err}` );
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

const editUserData = async (req, res) => {
    const {first_name, last_name, password, username, ...unwantedFields} = req.body;
    const {method, protocol, hostname, originalUrl} = req;
    logger.info(`Requested:${method} ${protocol}://${hostname}${originalUrl}`);
    const authUser = req.authUser.username;
    if (req.body.id || req.body.createdAt || req.body.updatedAt) {
        logger.warn('Request Failed: Invalid update operation');
        return res.status(400).json({
            message: "Invalid update operation. You can only update first name, last name, and password."
        });
    }
    if (Object.keys(unwantedFields).length > 0) {
        logger.warn('Request Failed: Invalid request fields');
        return res.status(400).json({
            message: "Invalid fields. You can only update first name, last name, and password"
        })
    }

    if (!(first_name || last_name || password)) {
        logger.warn('Request Failed: Required fields were missing');
        return res.status(400).json({
            message: " Invalid update operation. FirstName, LastName or Password are required"
        });

    }
    if (first_name && typeof first_name !== 'string') {
        logger.warn('Request Failed: Invalid datatype ');
        return res.status(400).json({
            message: "First name must be a string."
        });
    }

    if (last_name && typeof last_name !== 'string') {
        logger.warn('Request Failed: Invalid datatype ');
        return res.status(400).json({
            message: "Last name must be a string."
        });
    }

    if (password !== undefined) {
        if( typeof password !== 'string' || password.trim() === "") {
            logger.warn('Request Failed: Password was empty ');
            return res.status(400).json({
                message: "Password must be a non empty string."
            });
        }
        if (password.length <= 5) {
            logger.warn('Request Failed: Password criteria failed ');
            return res.status(400).json({
                message: "Minimum Password Length is 6 char"
            });
        }

    }
    if (req.body.username && req.body.username !== authUser) {
        console.log(authUser.username)
        logger.warn('Request Failed: Username cannot be updated');
        return res.status(400).json({
            message: "Username cannot be updated"
        });
    }

    try {
        const existingUser = await User.findOne({
            where: {
                username: authUser
            }
        });
        if (!existingUser) {
            logger.warn('Request Failed: Invalid Username');
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        existingUser.set({
            first_name: first_name || existingUser.first_name,
            last_name: last_name || existingUser.last_name,
            ...(password && {password: await bcrypt.hash(password, await bcrypt.genSalt(10))})
        });
        await existingUser.save();
        logger.info(`User Information Edited `);
        res.status(204).send();
    } catch (err) {
        logger.error(`Failed to update user details: ${err}`);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
const getUser = async (req, res) => {
    const {method, protocol, hostname, originalUrl} = req;
    logger.info(`Requested:${method} ${protocol}://${hostname}${originalUrl}`);
    const requestContent = req.headers['content-length'];
    const authUser = req.authUser.username;
    if (parseInt(requestContent) > 0) {
        logger.warn('Request Failed: payload detected for GET request');
        return res.status(400).send();
    }

    if (req.originalUrl.includes('?')) {
        logger.warn('Request Failed: Query parameters are not allowed');
        return res.status(400).send();
    }
    try {
        const user = await User.findOne({
            where:
                {
                    username: authUser
                },
            attributes:
                {
                    exclude: ['password','verification_token','email_verified','verification_token_expires']
                }

        });
        if (!user) {
            logger.warn('Request Failed: User not found');
            return res.status(404).json({
                message: "User not found"
            });
        }
        logger.info('User details fetched successfully ');
        return res.status(200).json(user);
    } catch (err) {
        logger.error(`GET User Failed: ${err}`);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
const verifyEmail = async (req, res) => {
    const token = req.query.token;
    if(!token)
    {
        logger.error(`Token is missing from API :  ${req.originalUrl}`);
        return res.status(400).send();
    }
    try {
        const user = await User.findOne({
            where: {
                verification_token: token,
                verification_token_expires: {
                    [Op.gt]: new Date(),
                },
            }
        });
        if (!user) {
            logger.warn('Verification Link Expired')
            return res.status(400).send(`<h1>Verification link is invalid or has expired.</h1>`);
        }

        user.email_verified = true;
        user.verification_token = null;
        user.verification_token_expires = null;
        await user.save();
        logger.info(`Email Verified for Username: ${user.username}`);
        return res.status(200).send('<h1>Your email has been successfully verified.</h1>');
    }
    catch (err){
        logger.error(`Email Verification Failed: ${err}`);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
module.exports = {
    createUser,
    editUserData,
    getUser,
    verifyEmail
}
