const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

const db = require('./models');

//Routers
const journalRouter = require("./routes/JournalEntries");
app.use("/JournalEntries", journalRouter);
const entryRouter = require("./routes/JournalEntry");
app.use("/JournalEntry", entryRouter);
const userRouter = require("./routes/Users");
app.use("/Users", userRouter);
const campaignRouter = require("./routes/Campaign");
app.use("/Campaign", campaignRouter);
const campaignPlayersRouter = require("./routes/CampaignPlayers");
app.use("/CampaignPlayers", campaignPlayersRouter);
const charactersRouter = require("./routes/Characters");
app.use("/Characters", charactersRouter);
const friendsRouter = require("./routes/Friends");
app.use("/Friends", friendsRouter);
const blockedRouter = require("./routes/Blocked");
app.use("/Blocked", blockedRouter);

app.use(express.static(path.join(__dirname, '../client/src')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/src', 'index.html'));
});

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});