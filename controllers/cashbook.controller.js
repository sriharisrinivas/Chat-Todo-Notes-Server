const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Cashbook = require("../models/cashbook.model");
const CashbookDetail = require("../models/cashbookDetails.model");
const userModel = require("../models/user.model");

const createNewCashbookController = async (request, response) => {
  try {
    // Creating Cashbook
    let userDetails = await userModel.findOne({ email: request.email });
    const cashbook = await Cashbook.create({ ...request.body, userId: userDetails._id });

    // Adding Cashbook to User
    await userModel.updateOne({ _id: userDetails._id }, { $push: { cashbooks: cashbook._id } });

    response.status(200).json(cashbook);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

const getCashbookNamesController = async (request, response) => {
  try {
    let userDetails = await userModel.findOne({ email: request.email });
    const cashbooks = await Cashbook.find({ userId: userDetails._id });
    response.status(200).json(cashbooks);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

const getCashbookDetailsController = async (request, response) => {
  try {
    // const cashbooks = await CashbookDetail.find({ cashbookId: request.params.id });
    const cashbooks = await CashbookDetail.aggregate([
      {
        $match: {
          cashbookId: new ObjectId(request.params.id)  // Assuming cashbookId is of type ObjectId
        }
      },
      {
        $sort: {
          date: 1
        }
      }
    ]);
    response.status(200).json(cashbooks);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

const createNewEntryController = async (request, response) => {
  try {
    // Creating Cashbook Entry
    const cashbookDetail = await CashbookDetail.create({ ...request.body, cashbookId: request.body.cbmId });

    // Adding Cashbook Entry to Cashbook
    await Cashbook.updateOne({ _id: request.body.cbmId }, { $push: { cashbookDetails: cashbookDetail._id } });
    response.status(200).json(cashbookDetail);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

const updateEntryController = async (request, response) => {
  try {
    const cashbooks = await CashbookDetail.findByIdAndUpdate(request.body.cbsmId, request.body);

    if (!cashbooks) {
      return response.status(404).json({ message: "Product not found" });
    }

    let updatedEntry = await CashbookDetail.findById(request.body.cbsmId);
    response.status(200).json(updatedEntry);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};


const deleteEntryController = async (request, response) => {
  try {
    const cashbooks = await CashbookDetail.findByIdAndDelete(request.params.id);

    // await Cashbook.updateOne({ _id: cashbooks.cashbookId }, { $pull: { cashbookDetails: request.params.id } });
    response.status(200).json(cashbooks);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNewCashbookController,
  getCashbookNamesController,
  createNewEntryController,
  updateEntryController,
  getCashbookDetailsController,
  deleteEntryController
};