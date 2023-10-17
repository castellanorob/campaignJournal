const express = require('express');
const router = express.Router();
const {Campaign} = require("../models");

router.get("/", async (req, res) => {
    const campaigns = await Campaign.findAll();
    res.json(campaigns);
});

router.post("/", async (req, res) => {
    const campaign = req.body;
    await Campaign.create(campaign);
    res.json(campaign);
})

module.exports = router;