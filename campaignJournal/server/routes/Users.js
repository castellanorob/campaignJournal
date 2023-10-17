const express = require('express');
const router = express.Router();
const {Users} = require("../models");
const bcrypt = require("bcrypt");

const{sign} = require("jsonwebtoken");
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get("/", async (req, res) => {
    const users = await Users.findAll();
    res.json(users);
});

router.post("/register", async (req, res) => {
    const {username, password} = req.body;

    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            username: username,
            password: hash,
        });
    });
    res.json("success");
});

router.post('/login', async(req, res) => {
    const {username, password} = req.body;

    const user = await Users.findOne({where: {
        username: username,
    }});

    if(!user){
        return res.json({error: "User not found"});
    }

    bcrypt.compare(password, user.password).then((match) => {
        if(!match){
            return res.json({error: "Incorrect username or password"});
        }
        const accessToken = sign(
            {username: user.username, id: user.id}, 
            "importantsecret"
            );

            const userResponse = {
                id: user.id,
                username: user.username
            }

            console.log("user" + user);
            console.log("userResponse" + userResponse)
        res.json({accessToken, user: userResponse});
    }
    
    );
});

router.get("/auth", validateToken, (req, res) =>{
    res.json(req.user);
})

module.exports = router;