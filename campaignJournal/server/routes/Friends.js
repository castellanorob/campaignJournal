const express = require('express');
const router = express.Router();
const {FriendRequests, Friends} = require("../models");
const { validateToken } = require('../middlewares/AuthMiddleware');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');

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
        const newFriends = await Friends.create({
            userId: userId,
            friendId: friendId
        })

        res.json(newFriends)
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
    const {senderId, receiverId, senderUsername, senderEmail} = req.body;

    console.log(`friendRequest req.body: ${JSON.stringify(req.body)}`);
    console.log(`senderId: ${JSON.stringify(senderId)}\n
    receiverId: ${JSON.stringify(receiverId)}`);

    try {
        const newFriendRequest = await FriendRequests.create({
            senderId: senderId,
            receiverId: receiverId
        });
////
        // let transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: "campaignjournaler@gmail.com",
        //         pass: "",
        //     },
        // });

        // let mailDetails = {
        //     from: "campaignjournaler@gmail.com",
        //     to: email,
        //     subject: "Campaign Journal Registration",
        //     text: `You have received a friend request from ${senderEmail}`
        // };

        // transporter.sendMail(mailDetails, function(error, info){
        //     if(error){
        //         console.log(error);
        //     } else {
        //         console.log("Email sent: " + info.response);
        //     }
        // });
///

        res.status(201).json(newFriendRequest);
    } catch (error) {
        console.log(`/friendRequest error: ${JSON.stringify(error)}`);
        res.json({ 
            message: "Failed to create friend request",
            error: error });
    }
})

module.exports = router;