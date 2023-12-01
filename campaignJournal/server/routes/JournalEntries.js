const express = require('express');
const router = express.Router();
const { JournalEntries } = require("../models");
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get("/:campaignId", validateToken, async (req, res) => {
    const campaignId = req.params.campaignId;
    const userId = req.params.userId;

    const { private: isPrivate } = req.query;

    let whereClause = {
        campaignId: campaignId
    };

    if (isPrivate === 'true') {
        // Fetch private entries for the current user
        whereClause.userId = userId;
    } else {
        // Fetch public entries
        whereClause.isPrivate = false;
    }

    const journalEntries = await JournalEntries.findAll({
        where: {
            campaignId: campaignId
        },
        order: [
            ['createdAt', 'DESC']
        ]
    });

    if(journalEntries.length === 0){
        return res.json([]);
    }
    res.json(journalEntries);
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