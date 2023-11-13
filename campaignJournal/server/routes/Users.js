const express = require('express');
const router = express.Router();
const {Users} = require("../models");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');

const{sign} = require("jsonwebtoken");
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get("/", async (req, res) => {
    const users = await Users.findAll();
    res.json(users);
});

router.post("/register", async (req, res) => {
    const {username, password, email} = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);
        const newUser = await Users.create({
            username: username,
            password: hash,
            email: email
        });

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "campaignjournaler@gmail.com",
                pass: "",
            },
        });

        let mailDetails = {
            from: "campaignjournaler@gmail.com",
            to: email,
            subject: "Campaign Journal Registration",
            text: "You have registered for Campaign Journal"
        };

        transporter.sendMail(mailDetails, function(error, info){
            if(error){
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

        res.json("success");
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Failed to register user", details: error.message });
    }
    
    // try {
    //     const hash = await bcrypt.hash(password, 10);
    //     const newUser = await Users.create({
    //         username: username,
    //         password: hash,
    //         email: email
    //     });
    //     res.json("success");
    // } catch (error) {
    //     console.error(error);
    //     res.status(400).json({ error: "Failed to register user", details: error.message });
    // }
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