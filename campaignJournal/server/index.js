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

console.log(`corsOptions: ${JSON.stringify(corsOptions)}`)

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));


//Routers
console.log("Registering JournalEntries router");
const journalRouter = require("./routes/JournalEntries");
app.use("/JournalEntries", journalRouter);

console.log("Registering JournalEntry router");
const entryRouter = require("./routes/JournalEntry");
app.use("/JournalEntry", entryRouter);

console.log("Registering Users router");
const userRouter = require("./routes/Users");
app.use("/Users", userRouter);

console.log("Registering Campaign router");
const campaignRouter = require("./routes/Campaign");
app.use("/Campaign", campaignRouter);

console.log("Registering CampaignPlayers router");
const campaignPlayersRouter = require("./routes/CampaignPlayers");
app.use("/CampaignPlayers", campaignPlayersRouter);

console.log("Registering Characters router");
const charactersRouter = require("./routes/Characters");
app.use("/Characters", charactersRouter);

console.log("Registering Friends router");
const friendsRouter = require("./routes/Friends");
app.use("/Friends", friendsRouter);

console.log("Registering Blocked router");
const blockedRouter = require("./routes/Blocked");
app.use("/Blocked", blockedRouter);

app.use(express.static(path.join(__dirname, '../client/build')));

app.use('/ProfileIcons', express.static('UploadedImages/ProfileIcons'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});


db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
