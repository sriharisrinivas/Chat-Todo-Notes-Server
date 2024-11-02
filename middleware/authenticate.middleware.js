const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (request, response, next) => {
    let jwtToken;
    const authHeader = request.headers["authorization"];
    if (authHeader !== undefined) {
        jwtToken = authHeader.split(" ")[1];
    }
    jwt.verify(jwtToken, process.env.SECRET_TOKEN_KEY, async (error, payload) => {
        if (error) {
            response.send({ message: "Invalid Access Token" });
        } else {
            request.email = payload.email;
            next();
        }
    });
};

module.exports = authenticateToken