/******************* Cash Book  **********************/
const express = require("express");
const { createNewCashbookController, getCashbookNamesController, createNewEntryController, getCashbookDetailsController, updateEntryController, deleteEntryController } = require("../controllers/cashbook.controller");
const authenticateToken = require("../middleware/authenticate.middleware");
const router = express.Router();

router.post("/createNewCashbook/", authenticateToken, createNewCashbookController);

router.get("/getCashbookNames/", authenticateToken, getCashbookNamesController);

router.post("/createNewEntry/", authenticateToken, createNewEntryController);

router.put("/updateEntry/", authenticateToken, updateEntryController);

router.get("/getCashbookDetails/:id/", getCashbookDetailsController);

router.delete("/deleteEntry/:id/", authenticateToken, deleteEntryController);

module.exports = router;




