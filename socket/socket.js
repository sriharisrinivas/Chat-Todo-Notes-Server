const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const app = express();

const { saveUpdateNotesController, fetchNoteDetailsController } = require("../controllers/notes.controller");
const { createMessageController, updateSeenMessages, getChatsController, getConversationsController, createChatController } = require("../controllers/chat.controller");
const { getUserDetailsFromToken } = require("../controllers/user.controller");
const { createGroupController, getGroupsController, createGroupMessageController, updateGroupController } = require('../controllers/group.controller');

/***socket connection */

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.REACT_URL,
        credentials: true
    }
});

//online user
let onlineUser = [];
let chatTypingStatusDetails = [];
let groupTypingStatusDetails = [];

io.on('connection', async (socket) => {

    console.log('Socket connected');

    /* Notes Starting */

    /* Update Notes */
    socket.on('update-notes', (msg) => {
        saveUpdateNotesController(msg, socket);
    });

    /* Get Note Details */
    socket.on('get-note-details', (msg) => {
        fetchNoteDetailsController(msg, socket);
    });

    /* Notes Ending */


    /* Chats Starting */

    /****************  Online Users ****************/

    /* Add online user */
    socket.on("add-online-user", async (token) => {
        const user = await getUserDetailsFromToken(token);

        if (user?._id) {
            onlineUser.push({ userId: user._id.toString(), socketId: socket.id });
            io.emit("online-users", onlineUser);
        }
    });

    /* Remove online user */
    socket.on("remove-online-user", async (token) => {
        const user = await getUserDetailsFromToken(token);

        if (user?._id) {
            onlineUser = onlineUser.filter(({ userId }) => userId !== user._id.toString());
            io.emit("online-users", onlineUser);
        }
    });

    /* Get all conversations for user */
    socket.on('get-conversations', (token, callback) => {
        getConversationsController(token, socket, onlineUser, callback);
    });

    socket.on('new-conversation', (request) => {
        createChatController(request, io, socket, onlineUser);
    });

    /* Create new conversation or new message */
    socket.on('new-message', (msg) => {
        createMessageController(msg, io, socket, onlineUser);
    });

    /* Update Seen Messages */
    socket.on('update-seen-messages', (msg) => {
        updateSeenMessages(msg, io, socket, onlineUser);
    });

    socket.on('add-chat-typing-status', (request) => {
        let receiver = onlineUser.find((obj) => obj.userId === request.receiverId);
        chatTypingStatusDetails.push(request);
        if (receiver) {
            io.to(receiver.socketId).emit('get-chat-typing-statuses', chatTypingStatusDetails);
        }

    });

    socket.on('remove-chat-typing-status', (details) => {
        chatTypingStatusDetails = chatTypingStatusDetails.filter(obj => obj.conversationId !== details.conversationId);
        let receiver = onlineUser.find((obj) => obj.userId === details.receiverId);
        if (receiver) {
            io.to(receiver.socketId).emit('get-chat-typing-statuses', chatTypingStatusDetails);
        }
    });


    /* Chats Ending */



    /* Groups Starting */

    socket.on('create-group', (request) => {
        createGroupController(request, io, socket, onlineUser);
    });

    socket.on('update-group-chat', (request) => {
        updateGroupController(request, io, socket, onlineUser);
    })

    socket.on('get-groups', (token, callback) => {
        getGroupsController(token, io, socket, callback);
    });

    socket.on('new-group-msg', (request) => {
        createGroupMessageController(request, io, socket, onlineUser);
    });

    
    socket.on('add-group-typing-status', (request) => {
        onlineUser.forEach((obj) => {
            if (request.members.includes(obj.userId)) {
                groupTypingStatusDetails.push(request);
                io.to(obj.socketId).emit('get-group-typing-statuses', groupTypingStatusDetails);
            }
        });
    });

    socket.on('remove-group-typing-status', (request) => {
        onlineUser.forEach((obj) => {
            if (request.members.includes(obj.userId)) {
                groupTypingStatusDetails = groupTypingStatusDetails.filter(obj => obj.groupId !== request.groupId);
                io.to(obj.socketId).emit('get-group-typing-statuses', groupTypingStatusDetails);
            }
        });
    });

    /* Groups Ending */

    socket.on('disconnect', async () => {
        // Remove online user
        if (socket?.handshake?.auth?.token) {
            const user = await getUserDetailsFromToken(socket.handshake.auth.token);

            if (user?._id) {
                onlineUser = onlineUser.filter(({ userId }) => userId !== user._id.toString());
                io.emit("online-users", onlineUser);
            }
        }
    });

});

module.exports = {
    app,
    server
};