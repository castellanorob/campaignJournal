const express = require('express');
const router = express.Router();
const {Campaign} = require("../models");
const { validateToken } = require('../middlewares/AuthMiddleware');

router.post("/:userId", validateToken, async (req, res) => {
    const campaign = req.body;

    const newCampaign = await Campaign.create(campaign);

    res.json(newCampaign);
});

router.get("/:campaignId", async (req, res) => {
    const campaignId = req.params.campaignId;
    

    const campaigns = await Campaign.findAll({
        where: {
            id: campaignId 
        },
    });
    if(campaigns.length === 0){
        return res.json([]);
    }

    res.json(campaigns);
});

module.exports = router;