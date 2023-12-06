const express = require('express');
const router = express.Router();
const {Users, FriendRequests, Friends, Sequelize} = require("../models");
const { validateToken } = require('../middlewares/AuthMiddleware');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');

const url = process.env.REACT_APP_URL || "http://localhost:3000"

router.get("/:userId", validateToken, async (req, res) => {
    try {
        const userId = req.params.userId;

        const friendSlist = await Friends.findAll({
            where: {
                userId: userId
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });

        res.json(friendSlist);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get friends list",
            error: error.message
        });
    }
});

router.get("/friendRequests/:userId", validateToken, async (req, res) => {

    console.log(`friendRequests/:userId called, userId: ${req.params.userId}`);
    try{
        console.log("inside try of friendRequests/:userId")
        const receiverId = req.params.userId;
        console.log(`receiverId: ${receiverId}`);

        const friendRequests = await FriendRequests.findAll({
            where:{
                [Op.and]: [
                    {receiverId: receiverId},
                    {status: "pending"}
                ]
            },
            logging: console.log 
        })

        console.log(`result of sql query ${JSON.stringify(friendRequests)}`);
        res.json(friendRequests)
    } catch(error){
        console.log(JSON.stringify(error));
        res.json(JSON.stringify(error));
    }
});

router.post("/addFriends", validateToken, async (req, res) => {
    const{userId, friendId} = req.body;

    try {
        const userFriend = await Friends.create({
            userId: userId,
            friendId: friendId
        })

        await Friends.create({
            userId: friendId,
            friendId: userId
        })

        res.json(userFriend)
    } catch(error){
        console.log(JSON.stringify(error));
        res.json(error);
    }
})

router.post("/updateFriendRequest", validateToken, async(req, res) => {
    const {senderId, receiverId, status} = req.body;

    try{
        const updatedFriendRequest = await FriendRequests.update(
            {status: status},
            {where: {
                [Op.and]:[
                    {senderId: senderId},
                    {receiverId: receiverId}
                ]
            }
        })
        res.json(updatedFriendRequest);
    } catch(error){
        console.log(JSON.stringify(error));
        res.json(error);
    }
})

router.post("/friendRequest", validateToken, async (req, res) => {
    const {senderId, senderEmail, receiverInfo} = req.body;

    console.log(`friendRequest req.body: ${JSON.stringify(req.body)}`);
    console.log(`senderId: ${JSON.stringify(senderId)}\n
    receiverInfo: ${JSON.stringify(receiverInfo)}/n sender email: ${senderEmail}`);

    try {

            const receiver = await Users.findOne({
                where:{
                    [Op.or]:[
                        {username: receiverInfo},
                        {email: receiverInfo}
                    ]
                }
            })

            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if(receiver){
                await FriendRequests.create({
                    senderId: senderId,
                    receiverId: receiver.id,
                    type: 'pending'
                });

                return res.json("Friend request sent")
            }else if (emailPattern.test(receiverInfo)){


                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: "campaignjournaler@gmail.com",
                        pass: "npxd otou vhww sgeb",
                    },
                });
        
                let mailDetails = {
                    from: "campaignjournaler@gmail.com",
                    to: receiverInfo,
                    subject: "Campaign Journal Registration",
                    text: `You have received a friend request from ${senderEmail}
                    Click here to create an account and play with your friends!
                    ${url}/Registration`

                };
        
                transporter.sendMail(mailDetails, function(error, info){
                    if(error){
                        console.log(error);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });

                const newUser = await Users.create({
                    username: 'invited',
                    password: 'notregistered',
                    email: receiverInfo
                })
                
                const friendRequest = await FriendRequests.create({
                    senderId: senderId,
                    receiverId: newUser.id,
                    type: 'pending'
                })

                if(!friendRequest || !newUser){
                    console.error("Error, unable to create temporary user account after sending email")
                }

                return res.json(`Invitation sent to ${receiverInfo}` )
            }else{
                res.status(404).json({error: "unable to find user, double check the spelling or provide an email address"});
            }
        }catch (error) {
        console.error("Error in /friendRequest:", error);
        res.json({ 
            message: "Failed to create friend request",
            error: error });
    }
})

module.exports = router;