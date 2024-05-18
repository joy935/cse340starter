// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController");
const { route } = require("./static");
const utilities = require("../utilities");
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build the single vehicle view
router.get("/detail/:singleId", invController.buildBySingleId);

// Route to build the vehicule management view
router.get("/", invController.buildManagementView);

// Route to build the add new classification view
router.get("/type", invController.buildAddClassification);

// Route to build the add new vehicle view
// router.get("/detail", invController.buildaddVehicle);

// Route to handle the add new classification form submission
router.post(
    "/type", 
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);
// router.post("/type", invController.addClassification);

// Route to handle the add new vehicle form submission

module.exports = router;