const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3001;
const db = require('./models');


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

let corsOptions;

if(process.env.ReactAppURL){
  corsOptions = {
    origin: process.env.ReactAppURL,
    credentials: true,
  }
}else{
  corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  }
}

console.log(`corsOptions: ${corsOptions}`)

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));


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

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
