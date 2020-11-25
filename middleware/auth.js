const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) return res.status(401).json({ errors: [{ "msg": "You are not allowed", "param": "__general__" }] });

    try {
        const word = jwt.verify(token, process.env.SECRET);
        req.user = word.user;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({ errors: [{ "msg": "The token is bad", "param": "__general__" }] });
    }
}