// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build the single vehicle view
router.get("/vehicule/:singleId", invController.buildBySingleId);

module.exports = router;