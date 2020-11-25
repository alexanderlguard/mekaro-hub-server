const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const authController = require('../controller/authController');
const auth = require('../middleware/auth');

router.get('/', auth, authController.getAuthUser);
router.post('/signup', 
    [
        check('username', 'The username is requierd').not().isEmpty().isLength( {min: 4} ),
        check('email', 'You need a validated email').isEmail(),
        check('password', 'The password must be more than 6 characters').isLength( {min: 6} )
    ],
    authController.signup
);
router.post('/login', 
    [
        check('username', 'The username is requierd').not().isEmpty().isLength( {min: 4} ).withMessage('The username must be at least 4 chars long'),
        check('password', 'The password must be more than 6 characters').isLength( {min: 6} )
    ],
    authController.login
);

module.exports = router;