const express = require('express');
const router = express.Router();
const {Blocked} = require("../models");
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get("/:userId/check-blocked/:userToCheckId", validateToken, async (req, res) => {
    const blockerId = parseInt(req.params.userId);
    const userToCheckId = parseInt(req.params.userToCheckId);
    

    const blocked = await Blocked.findOne({
        where: {
            blockerId: blockerId,
            blockedId: userToCheckId
        }
    });

    res.json(blocked);
});

router.post("/", validateToken, async (req, res) => {
    const {blockerId, blockedId} = req.body;

    try {
        const blocked = await Blocked.create({
            blockerId: blockerId,
            blockedId: blockedId
        });
        res.status(201).json(blocked);
    } catch (error) {
        res.status(500).json({ error: "Failed to block" });
    }
})

router.post("/unblock", validateToken, async (req, res) => {
    const {blockerId, blockedId} = req.body;

    try {
        const unblocked = await Blocked.update({
            status: false,
        },
        {
            where: {
                blockerId: blockerId,
                blockedId: blockedId
            }
        }
        );
        res.status(201).json(unblocked);
    } catch (error) {
        res.status(500).json({ error: "Failed to unblock" });
    }
})

module.exports = router;