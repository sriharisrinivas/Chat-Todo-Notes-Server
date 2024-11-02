const express = require("express");
const { createChatController, getChatsController, createMessageController, getMessagesController, getAllUsersController } = require("../controllers/chat.controller");
const authenticateToken = require("../middleware/authenticate.middleware");
const router = express.Router();

router.get("/getUsers", authenticateToken, getAllUsersController);

router.post("/createMessage", authenticateToken, createMessageController);

// router.post("/createChat", authenticateToken, createChatController);

// router.get("/getChats", authenticateToken, getChatsController);

// router.get("/getMessages/:chatId", authenticateToken, getMessagesController);


module.exports = router