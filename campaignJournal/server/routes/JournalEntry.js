const express = require('express');
const router = express.Router();
const { JournalEntries } = require("../models");
const { validateToken } = require('../middlewares/AuthMiddleware');

router.post("/byId/:id", validateToken, async (req, res) => {
    const journalEntry = req.body;

    res.json(journalEntry);
});

router.get("/byId/:id", async (req, res) => {
    const entryId = req.params.id;
    console.log(entryId)
    const entry = await JournalEntries.findByPk(entryId);

    res.json(entry);
});

router.put('/byId/:id', async (req, res) => {
    const { id } = req.params;
    const { entryBody } = req.body;
  
    try {
      // Find the journal entry by ID
      const journalEntry = await JournalEntries.findByPk(id);
  
      // Update the journal entry's bodyText
      if (journalEntry) {
        journalEntry.journalBody = entryBody;
        await journalEntry.save();
  
        // Send a success response
        res.status(200).json({ message: 'Update successful' });
      } else {
        // If the entry with the provided ID is not found, send a not found response
        res.status(404).json({ error: 'Journal entry not found' });
      }
    } catch (error) {
      console.error('Update error:', error);
  
      // Log the error details
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });

module.exports = router;