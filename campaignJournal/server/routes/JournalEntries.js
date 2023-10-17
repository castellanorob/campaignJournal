const express = require('express');
const router = express.Router();
const {JournalEntries} = require("../models");
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get("/:campaignId", validateToken, async (req, res) => {
    const campaignId = req.params.campaignId;

    const jounralEntries = await JournalEntries.findAll({
        where: {
            campaignId: campaignId 
        }
    });

    if(jounralEntries.length === 0){
        return res.json("Create your first entry");
    }
    res.json(jounralEntries);
});

router.post("/", validateToken, async (req, res) => {
    const journalEntry = req.body;
    await JournalEntries.create(journalEntry);
    res.json(journalEntry);
})

module.exports = router;