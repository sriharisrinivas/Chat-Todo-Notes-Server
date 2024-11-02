
const { ConversationModel, MessageModel } = require("../models/ConversationModel");
const userModel = require("../models/user.model");
const { getUserDetailsFromToken } = require("./user.controller");

// Get all registered users. 
const getAllUsersController = async (request, response) => {
    try {
        let users = await userModel.find({}).sort({ firstName: 1 });
        users = users.filter((user) => user.email.toString() !== request.email.toString());
        response.status(200).json(users);
    } catch (error) {
        response.status(400).json({ message: error.message });
    }
};

const getConversationsController = async (token, socket, onlineUsers, callback) => {
    try {

        const user = await getUserDetailsFromToken(token);

        let conversations = await ConversationModel.find({
            $or: [
                { sender: user._id },
                { receiver: user._id }
            ]
        }).sort({ updatedAt: -1 }).populate('messages').populate('sender').populate('receiver');

        conversations = conversations.map((conv) => {
            let members = [conv.sender, conv.receiver];
            let senderDetails = members.find((obj) => obj.id.toString() == user._id.toString())
            let receiverDetails = members.find((obj) => obj.id.toString() !== user._id.toString())
            const countUnseenMsg = conv?.messages?.reduce((preve, curr) => {
                const msgByUserId = curr?.msgByUserId?.toString();

                if (msgByUserId !== user._id) {
                    return preve + (curr?.seen ? 0 : 1);
                } else {
                    return preve;
                }
                
            }, 0);
            
            let isOnline = (onlineUsers).some(({ userId }) => userId === receiverDetails?._id.toString());
            
            return {
                _id: conv?._id,
                sender: conv?.sender,
                receiver: conv?.receiver,
                members: members,
                messages: conv?.messages,
                unseenMsg: countUnseenMsg,
                senderDetails: senderDetails,
                receiverDetails: receiverDetails,
                lastMsg: conv.messages[conv?.messages?.length - 1],
                isOnline
            };
        })
        
        callback(conversations);

    } catch (error) {
        console.log("error:", error);
    }
};

const createMessageController = async (request, io, socket, onlineUsers) => {
    try {
        // Finding convsersation exists btw the users or not.
        let conversation = await ConversationModel.findOne(
            {
                $or: [
                    { sender: request.senderId, receiver: request.receiverId },
                    { sender: request.receiverId, receiver: request.senderId },
                ]
            }
        );

        let isNewConversation = false;

        if (!conversation) {
            isNewConversation = true;
            conversation = await ConversationModel.create({
                sender: request.senderId,
                receiver: request.receiverId
            });
        }

        // Creating new message
        let msgObj = {
            text: request.message,
            imageUrl: '',
            videoUrl: '',
            msgByUserId: request.senderId,
            seen: false
        };

        let messageRes = await MessageModel.create(msgObj);

        // Updating conversation with new message document created.
        conversation.messages.push(messageRes._id);

        await conversation.save();

        let sender = onlineUsers.find((obj) => obj.userId === request.senderId);
        let receiver = onlineUsers.find((obj) => obj.userId === request.receiverId);

        if (receiver) {
            io.to(receiver.socketId).emit('conversation-updated', { sender, receiver });
            io.to(sender.socketId).emit('conversation-updated', { sender, receiver, isNewConversation });
        } else {
            io.to(sender.socketId).emit('conversation-updated', { sender, receiver, isNewConversation });
        }

    } catch (error) {
        console.log("error:", error);
    }
};

const updateSeenMessages = async (request, io, socket, onlineUsers) => {
    try {
        
        await MessageModel.updateMany(
            {
                _id: {
                    $in: request.unseenMsgIds
                }
            },
            {
                $set: {
                    seen: true
                }
            }
        )

        // io.emit('message-saved', 'message-saved-successfully')

        let sender = onlineUsers.find((obj) => obj.userId === request.userId);
        let receiver = onlineUsers.find((obj) => obj.userId === request.receiverId);

        if (receiver) {
            io.to(sender.socketId).to(receiver.socketId).emit('conversation-updated', { sender, receiver });
        } else {
            io.to(sender.socketId).emit('conversation-updated', { sender, receiver });
        }


    } catch (error) {
        // response.status(400).json({ message: error.message });
    }
};


const createChatController = async (request, io, socket, onlineUsers) => {
    try {
        // let conversation =  await ConversationModel.create({
        //     sender: request.userId,
        //     receiver: request.receiverId
        // });

        // let sender = onlineUsers.find((obj) => obj.userId === request.userId);
        // let receiver = onlineUsers.find((obj) => obj.userId === request.receiverId);

        // if (receiver) {
        //     io.to(sender.socketId).to(receiver.socketId).emit('conversation-created', conversation);
        // } else {
        //     io.to(sender.socketId).emit('conversation-created', conversation);
        // }


    } catch (error) {
        // response.status(400).json({ message: error.message });
    }
};








module.exports = { createChatController, getConversationsController, createMessageController, updateSeenMessages, getAllUsersController };