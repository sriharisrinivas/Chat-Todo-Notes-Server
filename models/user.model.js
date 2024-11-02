const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String
    },
    profilePic: {
        type: String
    },
    todos: {
        type: Array,
        default: []
    },
    cashbooks: {
        type: Array,
        default: []
    },
    notes: {
        type: Array,
        default: []
    }
},
    {
        timestamps: true
    }
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;