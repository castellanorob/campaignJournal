const express = require('express');
const router = express.Router();
const {Users} = require("../models");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

const{sign} = require("jsonwebtoken");
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get("/:userId", async (req, res) => {

    const userId = parseInt(req.params.userId);

    try{
        const user = await Users.findOne({
            where: {
                id: userId
            },
            attributes: { exclude: ['password'] }
        });
        delete user.password;
        res.json(user);
    }catch (error) {
        res.status(500).json({ error: "Failed to find user"})
    }

});

router.get("/findUser/:userInfo", validateToken, async(req, res) =>{
    const userInfo = req.params.userInfo;
    console.log(`userInfo:${JSON.stringify(userInfo)}`);
    try{
        const user = await Users.findOne({
            where:{
                [Op.or]:[
                    {username: userInfo},
                    {email: userInfo}
                ]
            },
            attributes: { exclude: ['password'] },
            logging: console.log
        });
        if (user) {
            console.log(`User found: ${JSON.stringify(user)}`);
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    }catch(err) {
        console.log(`findUser error: ${JSON.stringify(err)}`);
        res.json({error: `Failed to find user ${err}`});
    }
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

        this.delete(newUser.password);
        res.json(newUser);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Failed to register user", details: error.message });
    }
    
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
                username: user.username,
                icon: user.icon,
                email: user.email,
            }

            console.log("user" + user);
            console.log("userResponse" + userResponse)
        res.json({accessToken, user: userResponse});
    }
    
    );
});

router.get("/auth", validateToken, (req, res) =>{
    console.log("users/auth called")
    if (!req.user) {
        console.error("No user found in request");
        return res.status(500).json({ error: "Server error: User not found in request." });
    }
    this.delete(req.user.password);
    res.json(req.user);
});

module.exports = router;