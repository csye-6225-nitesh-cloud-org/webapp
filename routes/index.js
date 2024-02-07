const express = require('express')
const router = express.Router()
const health  =  require('./health.route')
const user = require('./user.route')
module.exports = {
    health,
    user
}
