const express = require('express');
const router = express.Router();
const { Characters } = require("../models");
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get("/", validateToken, async (req, res) => {
    const campaignId = req.body;
    

    const characters = await Characters.findAll({
        where: {
            campaignId: campaignId
        },
        order: [
            ['type', 'ASC']
        ]
    });
    if(characters.length === 0){
        return res.json([]);
    }

    res.json(characters);
});

router.post("/", async (req, res) => {
    const character = req.body;
    await Characters.create(character);
    res.json(character);
})

module.exports = router;
