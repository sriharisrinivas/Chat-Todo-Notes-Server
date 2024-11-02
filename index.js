const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const cashbookRouter = require("./routes/cashbook.route");
const userRouter = require("./routes/user.route");
const todosRouter = require("./routes/todo.route");
const chatRouter = require("./routes/chat.route");
const notesRouter = require("./routes/notes.route");
const { ConversationModel, MessageModel } = require("./models/ConversationModel");
const { server, app } = require("./socket/socket");
const GroupModel = require("./models/group.model");
require('dotenv').config();
/********** Middle Wares **********/

app.use(express.json());

app.use(cors({
    origin: process.env.REACT_URL,
    credentials: true
}));

/********** Routes **********/

app.use("/user", userRouter);

app.use("/todos", todosRouter);

app.use("/cb", cashbookRouter);

app.use("/chat", chatRouter);

app.use("/notes", notesRouter);

app.get('/greeting/:name/', (req, res) => {
    res.send(`Hello ${req.params.name}`);
});

app.get('/clearDB', async (req, res) => {
    await ConversationModel.deleteMany({});
    await MessageModel.deleteMany({});
    await GroupModel.deleteMany({});
    res.send("DB Cleared");
});

/********** Connection For Db And Server Initialization **********/

mongoose
    .connect(
        process.env.APP_TYPE === "Chat" ? process.env.MONGO_STRING_CHAT : process.env.MONGO_STRING)
        .then(() => {
            
        console.log("Connected to database!");

        server.listen(process.env.PORT, () => {
            console.log(`Server is running on port number ${process.env.PORT}`);
        });

    })
    .catch(() => {
        console.log("Connection failed!");
    });
