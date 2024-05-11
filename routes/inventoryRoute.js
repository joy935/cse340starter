// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build the single vehicle view
router.get("/detail/:singleId", invController.buildBySingleId);

// Route to generate an error in the footer
// router.get('/errors/:generateError', invController.generateError);
router.get('/broken-link', invController.generateError);

module.exports = router;