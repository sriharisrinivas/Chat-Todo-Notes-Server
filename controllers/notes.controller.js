const NotesModel = require("../models/notes.model");
const userModel = require("../models/user.model");

const createNotesController = async (request, response) => {
    try {
        const userDetails = await userModel.findOne({ email: request.email });
        const notes = await NotesModel.create({ ...request.body, userId: userDetails._id });
        await userModel.updateOne({ _id: userDetails._id }, { $push: { notes: notes._id } });
        response.status(200).json(notes);
    } catch (error) {
        response.status(400).json({ message: error.message });
    }
};

const updateNotesController = async (request, response) => { 
    try {
        const notes  = await NotesModel.updateOne({ _id: request.params.id }, { title: request.body.title });
        response.status(200).json(notes);
    } catch (error) {
        response.status(400).json({ message: error.message });
    }
 }

const fetchNotesListController = async (request, response) => {
    try {
        const userDetails = await userModel.findOne({ email: request.email });
        // const notes = await NotesModel.find({ userId: userDetails._id });
        const notes = await NotesModel.aggregate([
            { $match: { userId: userDetails._id } },
            { $sort: { title: 1 } }
        ]);
        response.status(200).json(notes);
    } catch (error) {
        response.status(400).json({ message: error.message });
    }
};

const fetchNoteDetailsController = async (request, socket) => {
    const notes = await NotesModel.findOne({ _id: request.id });
    socket.emit('get-note-details', notes);
}

const saveUpdateNotesController = async (request, socket) => {
    await NotesModel.updateOne({ _id: request.id }, { description: request.description });
};


module.exports = {
    createNotesController,
    updateNotesController,
    fetchNotesListController,
    fetchNoteDetailsController,
    saveUpdateNotesController
};