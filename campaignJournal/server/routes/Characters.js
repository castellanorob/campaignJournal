const express = require('express');
const router = express.Router();
const { Characters } = require("../models");
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get("/:campaignId", validateToken, async (req, res) => {
    const campaignId = req.params.campaignId;
    

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
    console.log(`character.post called - character: ${JSON.stringify(character)}`)
    const createdCharacter = await Characters.create(character);

    console.log(`character created, going to return called - character: ${JSON.stringify(createdCharacter)}`)
    res.json(createdCharacter);
})

module.exports = router;
