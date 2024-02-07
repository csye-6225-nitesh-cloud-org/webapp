const express = require('express');
const router = express.Router();
const  {createUser, editUserData, getUser } =  require('../controllers/UserController');
const  authMiddleware = require('../middlewares/auth');
const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
};
router.head('/user', (req,res) => {res.status(405).header(headers).send();});
router.head('/user/self', (req,res) => {res.status(405).header(headers).send();});
router.post('/user',createUser);
router.get('/user/self',authMiddleware, getUser);
router.put('/user/self',authMiddleware,editUserData);
router.options('/user', (req,res) => {res.status(405).header(headers).send();});
router.all('/user', (req,res) => {res.status(405).header(headers).send();});
router.all('/user/self', (req,res) => {res.status(405).header(headers).send();});

module.exports = router;
