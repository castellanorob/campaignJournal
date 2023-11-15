const express = require('express');
const router = express.Router();
const {CampaignPlayers} = require("../models");
const { validateToken } = require('../middlewares/AuthMiddleware');
const { Op } = require('sequelize');

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

router.get("/campaigners/:campaignId", validateToken, async (req, res) => {
    const campaignId = req.params.campaignId;
    
    try{
        const campaigners = await CampaignPlayers.findAll({
            where: {
                campaignId: campaignId 
            },
        });
        res.json(campaigners);
    }catch (error) {
        res.json({error: error.message, details: "Failed to find campaigners"})
    }

});

router.post("/updateRole", validateToken, async (req, res) =>{
    const updatedCampaignPlayer = req.body;

    console.log("update role. updatedCampaignPlayer", JSON.stringify(updatedCampaignPlayer));
    try{
        const campaignPlayer = await CampaignPlayers.update(
            {role: updatedCampaignPlayer.role},
            {
                where:{
                    [Op.and]:[
                        {userId: updatedCampaignPlayer.userId,},
                        {campaignId: updatedCampaignPlayer.campaignId}
                    ]
                }
            }
        )
        res.json(campaignPlayer);
    }catch(error){
        res.json({error: error.message})
    }
});

router.post("/", async (req, res) => {
    try {
        const campaignPlayer = req.body;
        console.log(`Campaign player called campaignPlayere: ${JSON.stringify(campaignPlayer)}`);
        console.log("campaignPlayer: ", campaignPlayer);
        const newCampaignPlayer = await CampaignPlayers.create(campaignPlayer);
        res.json(newCampaignPlayer);
    } catch (error) {
        res.status(500).json({ message: "Failed to add campaign player", error: error.message });
    }
});

module.exports = router;