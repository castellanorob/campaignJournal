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
    

    try {
        const campaign = await Campaign.findOne({
            where: { id: campaignId },
        });

        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }

        res.json(campaign);
    } catch (error) {
        console.error("Failed to retrieve campaign:", error);

        res.status(500).json({ message: "An error occurred while retrieving the campaign", error: error});
    }
});

module.exports = router;