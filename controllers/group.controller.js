const { MessageModel } = require("../models/ConversationModel");
const GroupModel = require("../models/group.model");
const { on } = require("../models/notes.model");
const { getUserDetailsFromToken } = require("./user.controller");


const getGroupsController = async (token, io, socket, callback) => {
    try {

        const user = await getUserDetailsFromToken(token);

        let groups = await GroupModel.find({
            members: {
                $in: [user._id.toString()]
            }
        }).sort({ updatedAt: -1 }).populate('members').populate('messages');

        groups = groups.map((group) => {
            const countUnseenMsg = group?.messages?.reduce((preve, curr) => {
                const msgByUserId = curr?.msgByUserId?.toString();

                if (msgByUserId !== user._id) {
                    return preve + (curr?.seen ? 0 : 1);
                } else {
                    return preve;
                }

            }, 0);


            return {
                ...group._doc,
                unseenMsg: countUnseenMsg,
                lastMsg: group.messages[group?.messages?.length - 1],
            };
        });

        callback(groups);
    } catch (error) {
        console.log("error:", error);
    }
};

const createGroupController = async (request, io, socket, onlineUsers) => {
    try {

        const user = await getUserDetailsFromToken(request.token);

        let record = {
            groupName: request.groupName,
            groupPic: process.env.GROUP_DP,
            members: [
                user._id.toString(),
                ...request.members
            ]
        };

        await GroupModel.create(record);     

        onlineUsers.forEach((obj) => {
            if (record.members.includes(obj.userId)) {
                io.to(obj.socketId).emit('group-created', "Success");
            }
        });

    } catch (error) {
        console.log("error:", error);
    }
};

const updateGroupController = async (request, io, socket, onlineUsers) => {
    try {
        const groupDetails = await GroupModel.findOne({ _id: request._id });
        
        groupDetails.groupPic = request.groupPic;

        await groupDetails.save();

        onlineUsers.forEach((obj) => {
            if (groupDetails.members.includes(obj.userId)) {
                io.to(obj.socketId).emit('group-updated', groupDetails._id);
            }
        });

    } catch (error) {
        console.log("error:", error);
    }
};

const createGroupMessageController = async (request, io, socket, onlineUsers) => {
    try {
        // Finding convsersation exists btw the users or not.
        let groupChat = await GroupModel.findOne({ _id: request.groupId });

        // Creating new message
        let msgObj = {
            text: request.message,
            imageUrl: '',
            videoUrl: '',
            messages:  [],
            msgByUserName: request.userName,
            msgByUserId: request.userId,
            seen: false
        };

        let messageRes = await MessageModel.create(msgObj);

        // Updating conversation with new message document created.
        groupChat.messages.push(messageRes._id);

        await groupChat.save();

        onlineUsers.forEach((obj) => {
            if (groupChat.members.includes(obj.userId)) {
                io.to(obj.socketId).emit('new-msg-created', "Success");
            }
        });

    } catch (error) {
        console.log("error:", error);
    }
};

module.exports = { createGroupController, getGroupsController, createGroupMessageController, updateGroupController };