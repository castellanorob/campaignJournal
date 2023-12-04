const express = require('express');
const router = express.Router();
const {Users} = require("../models");
const {CampaignPlayers} = require("../models");
const { sequelize } = require('../models');
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');

const{sign} = require("jsonwebtoken");
const { validateToken } = require('../middlewares/AuthMiddleware');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const uploadPath = path.join(__dirname, "../UploadedImages/ProfileIcons")
        cb(null, uploadPath)
    },

    filename: function (req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage });

router.post("/updateUser", validateToken, upload.single('icon'), async (req, res) =>{

    console.log(`inside update user.`)
    const file = req.file;
    const {username, email, userId} = req.body;

    console.log(`username: ${username}, email: ${email}, userId: ${userId}`)
    let updateData = {
        username: username,
        email: email
    }

    if(file){
        console.log(`New file submitted ${file.filename}`)
        updateData.icon = file.filename
    }

    console.log(`before updating user. new user data: ${JSON.stringify(updateData)}`);

    try{
        await Users.update(updateData,{
            where: {
                id: userId
            }
        })

        const updatedUser = await Users.findOne({
            where: {id: userId},
            attributes: { exclude: ['password']}
        });

        if(updatedUser){
            console.log(`after updating user. infomration: ${JSON.stringify(updatedUser)}`);
            res.json(updatedUser)
        }else{
            res.status(404).send("User not found");
        }
    }catch(error){
        res.json(error)
    }
})

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

router.get("/auth", validateToken, (req, res) =>{
    console.log("users/auth called")
    if (!req.user) {
        console.error("No user found in request");
        return res.status(500).json(error);
    }
    delete(req.user.password);
    res.json(req.user);
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

router.post("/inviteUser/:userInfo", validateToken, async(req, res) =>{
    const userInfo = req.params.userInfo;
    const {campaignId} = req.body
    console.log(`userInfo:${JSON.stringify(userInfo)}`);

    try{

        const transaction = await sequelize.transaction();

        let user = await Users.findOne({
            where:{
                [Op.or]:[
                    {username: userInfo},
                    {email: userInfo}
                ]
            },
            attributes: { exclude: ['password'] },
            logging: console.log
        }, {transaction: transaction});

        if (user) {
            console.log(`User found: ${JSON.stringify(user)}`);
            let campaignPlayer = await CampaignPlayers.create({
                userId: user.id,
                campaignId: campaignId,
                role: "invited"
            }, {transaction: transaction});

            await transaction.commit();
            
            return res.json(campaignPlayer);

        } else {
            console.log(`user not found. userInfo: ${userInfo}`);
            if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(userInfo)) {
                let mailDetails = {
                    from: "campaignjournaler@gmail.com",
                    to: userInfo,
                    subject: "You have been invited to a campaign",
                    text: "You have been invited to a Campaign. Use the link below to register\nhttp://localhost:3000/Registration"
                };

                const info = await transporter.sendMail(mailDetails)

                try{
                    if(info){
                        const invitedUser = await Users.create({
                            username: "invited",
                            password: "notregistered",
                            email: userInfo,
                            icon: "default.png"
                        }, {transaction: transaction})
        
                        await transaction.commit();
        
                        return res.json(invitedUser);
                    }
                }catch(error){
                    await transaction.rollback();
                    return res.status(500).json({error: "Failed to send invite email"});
                }
            } else {
                await transaction.rollback();
                res.status(404).json({error: "Username not found" });
            }
        }
    }catch(err) {
        if(transaction) await transaction.rollback();
        console.log(`findUser error: ${JSON.stringify(err)}`);
        res.json(err);
    }
});

//TODO update link sent in email be a one time use link created using a token. Create page in client under pages/tokenpages to handle registering the user, simply have it direct them directly to their profile page
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
                  username:username,
                  password: hash,
                  playerInvitationToken: null,
                  playerInvitationExpiry: null
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
                return res.status(400).json({error: "username already in use"});
              }else{
                const token = crypto.randomBytes(20).toString("hex");
                const registrationTokenExpiry = Date.now() + 3600000 * 24*5;

                const hash = await bcrypt.hash(password, 10);
                const newUser = await Users.create({
                    username: username,
                    password: hash,
                    email: email,
                    icon: "default.png",
                    emailRegistrationToken: token,
                    emailRegistrationExpires: registrationTokenExpiry
                });


                const emailBody = `Click the link below to verify your email and finish setting up your accout
                http://localhost:3000/RegisterUser/${token}
                
                This link will expire in 5 days.`
        
                let mailDetails = {
                    from: "campaignjournaler@gmail.com",
                    to: email,
                    subject: "Campaign Journal Registration",
                    text: emailBody
                };

                transporter.sendMail(mailDetails, function(error, info){
                    if(error){
                        console.log("/register - error:", error);
                    } else {
                        console.log("/register - Email sent: " + info.response);
                    }
                });
        
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
    const {userInfo, password} = req.body;

    console.log(`login called.
    userInfo: ${JSON.stringify({userInfo})}`)

    const user = await Users.findOne({where: {
        [Op.or]:[
            {username: userInfo},
            {email: userInfo}
        ]
    }});

    if(!user){
        return res.json({error: "user not found"});
    }

    if(user.password === "notregistered"){
        return res.json({error: "please register this account"});
    }

    bcrypt.compare(password, user.password).then(async (match) => {
        if(!match){
            return res.json({error: "invalid credentials"});
        }else{
            const accessToken = sign(
                {username: user.username, id: user.id}, 
                "importantsecret"
                );

                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    //secure: true, // Only use this in production with HTTPS
                    sameSite: 'strict'
                });
    
                const userResponse = {
                    id: user.id,
                    username: user.username,
                    icon: user.icon,
                    email: user.email,
                }
    
                console.log("user" + user);
                console.log("userResponse" + userResponse)
            res.json({user: userResponse});
            await Users.update({
                lastLoginDate: Date.now()
            },{
                where: {
                    id: user.id
                }
            });
        }
    }
    
    );
});

router.post('/forgotPassword', async(req, res) =>{
    console.log("forgotPassword called")
    const {email} = req.body;

    console.log(`email: ${JSON.stringify(email)}`);

    try{
        const user = await Users.findOne(
            {where: {
             email: email
        }});
        

        if(user){

            const token = crypto.randomBytes(20).toString("hex");
            const resetTokenExpiry = Date.now() + 3600000 * 24;

            await Users.update({
                resetPasswordToken: token,
                resetPasswordExpires: resetTokenExpiry
            },{
                where: {
                    id: user.id
                },
            });

            const emailBody = `We received a request to change the password
            Click the link below to reset your password
            http://localhost:3000/ResetPassword/${token}
            
            You will have 24 hours to reset your password. After that, you'll have to send another request.
            
            If you didn't request a new password, feel free to ignore this email`;

            let mailDetails = {
                from: "campaignjournaler@gmail.com",
                to: email,
                subject: "Campaign Journal password reset request",
                text: emailBody
            };

            transporter.sendMail(mailDetails, function(error, info){
                if(error){
                    console.log("/register - error:", error);
                    res.status(500).json({error: `unable to send email: ${error}`});
                } else {
                    console.log("/register - Email sent: " + info.response);
                    res.status(200).json({email: email});
                }
            });

        }else{
            res.status(400).json({error: "Email not in use"});
        }
    }catch(error){
        console.log(error);
    }
});

router.post("/resetPassword/:token", async (req, res) =>{
    const {token} = req.params;
    const updatedData = req.body;

    try{
        const user = await Users.findOne({
            where: {
                [Op.and]: [
                    {resetPasswordToken: token},
                    {username: updatedData.username},
                    {email: updatedData.email}
                ]
,            },
            attributes: { exclude: ['password'] }
        });
    
        if(user){
            if(user.resetPasswordExpires < Date.now()){
                res.status(401).json({error: "This link has expired"});
            }else{

                const hash = await bcrypt.hash(updatedData.password, 10);
                const [updatedUsersCount] = await Users.update({
                    password: hash,
                    resetPasswordToken: null,
                    resetPasswordExpires: null
                },{
                    where:{
                        id: user.id
                    }
                });

                if(updatedUsersCount === 0){
                    res.status(400).json({error: 'user not found'});
                }else{
                    res.json({success: 'password updated'});
                }
            }
        }else{
            res.status(400).json({error: 'invalid url'});
        }
    }catch(error){
        console.log(`error in /reset-password/:token
        token: ${token}
        error: ${error}`);
        res.status(400).json({error: error});
    }
});

module.exports = router;