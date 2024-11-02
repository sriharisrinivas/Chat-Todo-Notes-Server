const { default: mongoose, Schema } = require("mongoose");

const cashbookDetailsSchema = mongoose.Schema(
    {
        description: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        transactionType: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        cashbookId: {
            type: Schema.Types.ObjectId,
            ref: 'Cashbook',
            required: true
        },
    },
    {
        timestamps: true,
    }
);

const CashbookDetail = mongoose.model("CashbookDetail", cashbookDetailsSchema);

module.exports = CashbookDetail;