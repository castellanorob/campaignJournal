const express = require('express');
const router = express.Router();
const {CampaignPlayers} = require("../models");
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get("/:userId", validateToken, async (req, res) => {
    const userId = req.params.userId;
    

    const campaigns = await CampaignPlayers.findAll({
        where: {
            userId: userId 
        },
    });
    if(campaigns.length === 0){
        return res.json([]);
    }

    res.json(campaigns);
});

router.post("/", async (req, res) => {
    const campaignPlayer = req.body;
    await CampaignPlayers.create(campaignPlayer);
    res.json(campaignPlayer);
})

module.exports = router;