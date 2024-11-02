const { default: mongoose, Schema } = require("mongoose");

const CashbookSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        cashbookDetails : {
            type: Array,
            default: []
        }
    },
    {
        timestamps: true,
    }
);


const Cashbook = mongoose.model("Cashbook", CashbookSchema);

module.exports = Cashbook;