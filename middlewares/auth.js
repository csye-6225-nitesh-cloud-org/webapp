const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if( !authHeader || !authHeader.startsWith("Basic ") )
    {
        return res.status(401).json({
            message:"Missing authorization header"
        });
    }
    const decodedHeader = authHeader.split(" ")[1];
    const userDetails = Buffer.from(decodedHeader,'base64').toString('utf-8').split(":");
    const username = userDetails[0];
    const password = userDetails[1];
    const user = await User.findOne({
        where:{username}});

    if(!user || !(await bcrypt.compare(password,user.password))){
        return res.status(401).json({
            message:"Invalid Username or Password"
        });
    }

    req.authUser = {
        userId: user.id,
        username: user.username
    };
    next();

}

module.exports = authMiddleware;