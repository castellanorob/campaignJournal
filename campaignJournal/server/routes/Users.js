const express = require('express');
const router = express.Router();
const {Users} = require("../models");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

const{sign} = require("jsonwebtoken");
const { validateToken } = require('../middlewares/AuthMiddleware');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "campaignjournaler@gmail.com",
        pass: "npxd otou vhww sgeb",
    },
});


router.get("/", async (req, res) => {
    const users = await Users.findAll();
    res.json(users);
});

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
        res.status(500).json(error)
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
            return res.json(user);
        } else {
            console.log(`user not found. userInfo: ${userInfo}`);
            if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(userInfo)) {
                let mailDetails = {
                    from: "campaignjournaler@gmail.com",
                    to: userInfo,
                    subject: "You have been invited to a campaign",
                    text: "You have been invited to a Campaign. Use the link below to register\nhttp://localhost:3000/Registration"
                };

                transporter.sendMail(mailDetails, async function(error, info){
                    if(error){
                        console.log(error);
                    } else {
                        const invitedUser = await Users.create({
                            username: "invited",
                            password: "notregistered",
                            email: userInfo,
                            icon: "default.png"
                        })
                        console.log("Email sent: " + info.response + "user created: " + invitedUser);
                        return res.json(invitedUser);
                    }
                });
            } else {
                res.status(404).json(error);
            }
        }
    }catch(err) {
        console.log(`findUser error: ${JSON.stringify(err)}`);
        res.json(err);
    }
});

router.post("/register", async (req, res) => {
    const {username, password, email} = req.body;

    try {
        const existingUserWithEmail = await Users.findOne({
            where: { email },
          });

          if(existingUserWithEmail) {
            if (existingUserWithEmail.username === "invited") {
                console.log("/register - invited user");
                const hash = await bcrypt.hash(password, 10);
                await existingUserWithEmail.update({
                  username,
                  password: hash,
                });
                const updatedUser = {
                    id: existingUserWithEmail.id,
                    username: existingUserWithEmail.username,
                    email: existingUserWithEmail.email,
                    icon: existingUserWithEmail.icon,
                    message:"Registration complete"
                }
                console.log(`/register - Invited user about to return there should be no password in the response and it should have a message. updatedUser: ${JSON.stringify(updatedUser)}`);
                return res.json(updatedUser);
            } else{
                console.log("/register - existingUserWithEmail.username != \"invited\" ");
                return res.status(400).json({error: "That email is already in use"});
            }
          } else {
            console.log("/register - Not existingUserWithEmail");
            const existingUserWithUsername = await Users.findOne({
                where: { username },
              });

              if(existingUserWithUsername){
                console.log("/register - exisiting username")
                return res.status(400).json(error);
              }else{
                const hash = await bcrypt.hash(password, 10);
                const newUser = await Users.create({
                    username: username,
                    password: hash,
                    email: email,
                    icon: "default.png"
                });
        
                let mailDetails = {
                    from: "campaignjournaler@gmail.com",
                    to: email,
                    subject: "Campaign Journal Registration",
                    text: "You have registered for Campaign Journal"
                };

                transporter.sendMail(mailDetails, function(error, info){
                    if(error){
                        console.log("/register - error:", error);
                    } else {
                        console.log("/register - Email sent: " + info.response);
                    }
                })
        
                newUserData = {
                    username: newUser.username,
                    email: newUser.email,
                    icon: newUser.icon,
                    message: "Confirmation email sent"
                }
                return res.json(newUserData);
              }
          }
    } catch (error) {
        console.error("/register - error:", error);
        res.status(400).json(error);
    }
    
});

router.post('/login', async(req, res) => {
    const {username, password} = req.body;

    const user = await Users.findOne({where: {
        username: username,
    }});

    if(!user){
        return res.json({error: "user not found"});
    }

    if(user.password === "notregistered"){
        return res.json({error: "please register this user"});
    }

    bcrypt.compare(password, user.password).then((match) => {
        if(!match){
            return res.json({error: "invalid password"});
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
        return res.status(500).json(error);
    }
    delete(req.user.password);
    res.json(req.user);
});

module.exports = router;