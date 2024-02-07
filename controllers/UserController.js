const User = require("../models/user.model");
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    const {first_name, last_name, password, username, ...unwantedFields} = req.body;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (req.originalUrl.includes('?')) {
        return res.status(400).send();
    }
    if (Object.keys(unwantedFields).length > 0) {
        return res.status(400).json({
            message: "Invalid request body: contains unwanted fields."
        })
    }
    if (!first_name || !last_name || !password || !username) {
        return res.status(400).json({
            message: "Invalid Request Body"
        });
    }
    if (typeof first_name !== 'string' || typeof last_name !== 'string' || typeof password !== 'string') {
        return res.status(400).json({
            message: "Name and Password must be String"
        });
    }
    if (password.length <= 5) {
        return res.status(400).json({
            message: "Minimum Password Length is 6 char"
        });
    }
    if (!emailRegex.test(username)) {
        return res.status(400).json({
            message: "Invalid Email Format"
        });
    }
    if (req.body.id || req.body.createdAt || req.body.updatedAt) {
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
            return res.status(409).json({
                message: "Username already exists"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            first_name,
            last_name,
            username,
            password: hashedPassword
        });
        res.status(201).json({
            id: newUser.id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            username: newUser.username,
            account_created: newUser.account_created,
            account_updated: newUser.account_updated
        });
    } catch (err) {
        return res.status(400).json({
            message: "Invalid request"
        });
    }
}

const editUserData = async (req, res) => {
    const {first_name, last_name, password, username, ...unwantedFields} = req.body;
    const authUser = req.authUser.username;
    if (req.body.id || req.body.createdAt || req.body.updatedAt) {
        return res.status(400).json({
            message: "Invalid update operation. You can only update first name, last name, and password."
        });
    }
    if (Object.keys(unwantedFields).length > 0) {
        return res.status(400).json({
            message: "Invalid fields. You can only update first name, last name, and password"
        })
    }

    if (!(first_name || last_name || password)) {
        return res.status(400).json({
            message: " Invalid update operation. FirstName, LastName or Password are required"
        });

    }
    if (first_name && typeof first_name !== 'string') {
        return res.status(400).json({
            message: "First name must be a string."
        });
    }

    if (last_name && typeof last_name !== 'string') {
        return res.status(400).json({
            message: "Last name must be a string."
        });
    }

    if (password && typeof password !== 'string') {
        return res.status(400).json({
            message: "Password must be a string."
        });
    }
    if (password && password.length <= 5) {
        return res.status(400).json({
            message: "Minimum Password Length is 6 char"
        });
    }
    try {
        const existingUser = await User.findOne({
            where: {
                username: authUser
            }
        });
        if (!existingUser) {
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
        res.status(204).send();
    } catch (err) {
        return res.status(400).json({
            message: "Invalid request"
        });
    }
}
const getUser = async (req, res) => {
    const requestContent = req.headers['content-length'];
    const authUser = req.authUser.username;
    if (parseInt(requestContent) > 0) {
        return res.status(400).send();
    }

    if (req.originalUrl.includes('?')) {
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
                    exclude: ['password']
                }

        });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json(user);
    } catch (err) {
        return res.status(400).json({
            message: "Invalid request"
        });
    }
}

module.exports = {
    createUser,
    editUserData,
    getUser
}
