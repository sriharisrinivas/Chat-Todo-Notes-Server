const express = require("express");
const authenticateToken = require("../middleware/authenticate.middleware");
const { createNotesController, fetchNotesListController, fetchNoteDetailsController, saveUpdateNotesController, updateNotesController } = require("../controllers/notes.controller");
const route = express.Router();

route.post("/createNotes/", authenticateToken, createNotesController);

route.post("/updateNotes/:id", authenticateToken, updateNotesController);

route.get("/fetchNotesList/", authenticateToken, fetchNotesListController);

module.exports = route