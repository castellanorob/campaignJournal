const express = require('express');
const router = express.Router();
const { users } = require("../models");
const bcrypt = require("bcrypt");
const {validateToken} = require("../middlewares/AuthMiddleware")

const{sign} = require("jsonwebtoken")

router.post("/", async (req, res) => {
    const {username, password} = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        users.create({
            username: username,
            password: hash
        });
    });
    res.json("Success");
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await users.findOne({ where: {username: username } });

    if(!user) {
        res.json({ error: "User not found" });
        return;
    }

    bcrypt.compare(password, user.password).then((match) => {
        if (!match){
            res.json({error: "Incorrect username or password"});
            return;
        }

        const accessToken = sign(
            { username: user.username, userid: user.id },
            "importantsecret"
            );
        res.json({token: accessToken, username: username, userid: user.id}); 
    });
});

router.get("/:userId", validateToken, async (req, res) => {
    const id = req.params.userId;

    const user = await users.findByPk(id)
    res.json(user);
});

router.get("/auth", validateToken, (req, res) => {
    res.json(req.user);
});

module.exports = router;