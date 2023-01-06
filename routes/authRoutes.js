const express = require('express');
const router = express.Router();

const { register,
        login,
        logout } = require('../controllers/authControllers')

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').delete(logout);
// router.route('/newToken').post(newToken);

module.exports = router ;