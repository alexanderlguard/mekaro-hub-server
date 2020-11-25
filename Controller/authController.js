const User = require('../model/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.login = async(req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) 
        return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;

    
    try {
        let user = await User.findOne( { username } );

        if (!user) return res.status(400).json({ errors: [{ "msg": "The username or the password is incorrect", "param": "username" }] } );

        const passCorrect = await bcryptjs.compare(password, user.password);

        if (!passCorrect) return res.status(400).json({ errors: [{ "msg": "The username or the password is incorrect", "param": "username" }] } );

        const authUser = await User.findOne({ username }).select('-password');

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.SECRET, { expiresIn: 3600 }, (error, token) => { 
            if (error) throw error;

            res.json({ token: token, user: authUser });
        });
    } catch (error) {
        console.log(error);
        res.status(400).send( { errors: [{ "msg": "There has been an error!!", "param": "__general__" }] });
    }
}

exports.signup = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) 
        return res.status(400).json({ errors: errors.array() });

    const { username, email, password } = req.body;

    try {
        let userByEmail = await User.findOne( { email } );
        let userByUsername = await User.findOne( { username } );

        let errors = [];

        if (userByEmail) 
            errors.push( { "msg": "The email already exists", "param": "email" } );

        if (userByUsername) 
            errors.push( { "msg": "The username already exists", "param": "username" } );
        
        if (errors.length > 0)
            return res.status(400).json({errors: errors});
        
        let user = new User(req.body);

        const salt = await bcryptjs.genSalt(10);
        
        user.password = await bcryptjs.hash( password, salt );

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        const authUser = await User.findById(user.id).select('-password');

        jwt.sign(payload, process.env.SECRET, { expiresIn: 3600 }, (error, token) => { 
            if (error) throw error;

            res.json({ token: token, user: authUser });
        });

    } catch (error) {
        console.log(error);
        res.status(400).send( { errors: [{ "msg": "There has been an error!!", "param": "__general__" }] });
    }
}

exports.getAuthUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        res.json({user});
    } catch (error) {
        console.log(error);
        res.status(400).send( { errors: [{ "msg": "There has been an error!!", "param": "__general__" }] });     
    }
}