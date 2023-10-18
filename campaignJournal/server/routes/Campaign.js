const express = require('express');
const router = express.Router();
const {Campaign} = require("../models");
const { validateToken } = require('../middlewares/AuthMiddleware');
const { getCampaignsByIds } = require('./CampaignService');

router.get("/", validateToken, async (req, res) => {
    
    const campaigns = await Campaign.findAll()
    // const userId = req.params.userId;
    // console.log(userId);
    // const campaigns = await Campaign.findAll({
    //     where: {
    //         userId: userId 
    //     },
    // });
    // if(campaigns.length === 0){
    //     return res.json([]);
    // }
    res.json(campaigns);
});

router.post("/", validateToken, async (req, res) => {
    const campaign = req.body;
    await Campaign.create(campaign);
    res.json(campaign);
})

module.exports = router;