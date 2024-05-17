// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build the single vehicle view
router.get("/detail/:singleId", invController.buildBySingleId);

// Route to build the vehicule management view
router.get("/", invController.buildManagementView);

module.exports = router;