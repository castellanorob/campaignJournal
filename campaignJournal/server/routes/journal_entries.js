const express = require('express');
const router = express.Router();
const { journal_entries } = require("../models");

const {validateToken} = require('../middlewares/AuthMiddleware');


router.get("/:campaignId", validateToken, async (req, res) => {
    const campaign_id = req.params.campaignId;

    const entries = await journal_entries.findAll({
        where: {
            campaignId: campaign_id,
        },
    });
    res.json(entries);
});

router.post("/", validateToken, async (req, res) => {
    const journal_entry = req.body;
    await journal_entries.create(journal_entry);
    res.json(journal_entry);
});