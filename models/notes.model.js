const { default: mongoose, Schema } = require("mongoose");

const notesSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ''
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);


const NotesModel = mongoose.model("Notes", notesSchema);

module.exports = NotesModel