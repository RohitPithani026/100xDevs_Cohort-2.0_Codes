const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// Middleware for handling auth
function adminMiddleware(req, res, next) {
    const token = req.headers.authorization;
    const words = token.split(" ");
    const jwtToken = words[1];
    try{
        const decodedValue = jwt.verify(jwtToken, JWT_SECRET);
        if(decodedValue.username) {
            next();
        } else {
            res.status(403).json({
                msg: "You are not authenticated"
            });
        }
    } catch(e) {
        res.json({
            msg: "Incorrect token"
        })
    }
}

module.exports = adminMiddleware;