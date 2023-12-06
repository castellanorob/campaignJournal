const express = require('express');
const router = express.Router();
const { JournalEntries } = require("../models");
const { validateToken } = require('../middlewares/AuthMiddleware');
const { Op } = require('sequelize');

router.get("/:data", validateToken, async (req, res) => {
    const data = req.params.data;

    console.log(data);

    const splitData = data.split(",");

    console.log(splitData);

    let IDs = splitData.map(id => parseInt(id, 10));
    const campaignId = IDs[0];
    const userId = IDs[1];

    console.log(`get journalEntries by campaign called: campaignId: ${campaignId}, userId: ${userId}`);

    if(campaignId == "NaN"){
        return res.json({error: "You need to select a campaign first"})
    }

    try{
        const journalEntries = await JournalEntries.findAll({
            where: {
                campaignId: campaignId,
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });
    
        if(journalEntries.length === 0){
            return res.json([]);
        }
    
        console.log(`\n returning journalEntries: ${JSON.stringify(journalEntries)}`)
    
        const visibleEntries = journalEntries.filter(entry => entry.privateEntry === false || (entry.privateEntry === true && entry.userId === userId));
    
        console.log(`returning visibleEntries: ${JSON.stringify(visibleEntries)}`)
        return res.json(visibleEntries);
    }catch(error){
        return res.json(error)
    }
});

router.get("/JournalEntries/byId/:id", async (req, res) => {
    const id = req.params.id;
    const entry = await JournalEntries.findByPk(id);
    res.json(entry)
})

router.post("/", validateToken, async (req, res) => {
    const journalEntry = req.body;
    console.log(`journalEntry req.body: ${JSON.stringify(journalEntry)}`);
    await JournalEntries.create(journalEntry);
    res.json(journalEntry);
})

module.exports = router;