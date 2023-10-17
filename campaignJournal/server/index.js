const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const db = require('./models');

//Routers
const journalRouter = require("./routes/JournalEntries");
app.use("/JournalEntries", journalRouter);
const userRouter = require("./routes/Users");
app.use("/Users", userRouter);
const campaignRouter = require("./routes/Campaign");
app.use("/Campaign", campaignRouter);

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001");
    });
});