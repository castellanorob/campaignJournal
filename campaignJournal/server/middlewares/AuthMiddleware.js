const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    console.log("\n\n")
    console.log("validateToken called"); // To check if middleware is reached
    console.log(`Request URL: ${req.originalUrl}`);
    console.log(`req.cookies: ${JSON.stringify(req.cookies)}`);

    const token = req.cookies.accessToken; // Directly use accessToken from headers

    if (!token) {
        console.log("No token provided\n\n"); // Log if no token is found
        return res.status(401).json({ error: "User not logged in" });
    }

    try {
        const validatedToken = verify(token, "importantsecret");
        req.user = validatedToken;
        console.log(`Token is valid ${JSON.stringify(req.user)}\n\n`); // Log the validated token
        next();
    } catch (err) {
        console.error(`Token validation error ${err}\n\n`); // Log any validation error
        return res.status(401).json({ error: "Token is not valid" });
    }
};

module.exports = { validateToken };