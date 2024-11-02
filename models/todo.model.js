const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Todo schema
const todoSchema = new Schema({
    task: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        default: "New"
    },
    severity: {
        type: String,
        default: "Low"
    },
    severityCode: {
        type: Number,
        default: 1
    },
    category: {
        type: String,
        default: "Personal"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dueDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Create Todo model
const TodoModel = mongoose.model('Todo', todoSchema);

module.exports = TodoModel;
