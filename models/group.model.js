const { default: mongoose } = require("mongoose");

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true
    },
    groupPic: {
        type: String
    },
    members: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    messages: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Message'
        }
    ]
}, {
    timestamps: true
}); 


const GroupModel = mongoose.model('Group', groupSchema);
module.exports = GroupModel;
