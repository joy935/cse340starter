// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController");
const { route } = require("./static");
const utilities = require("../utilities");
const invValidate = require('../utilities/inventory-validation')
const authorisationMiddleware = require("../middleware/authorisationMiddleware");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build the single vehicle view
router.get("/detail/:singleId", invController.buildBySingleId);

// Route to build the vehicule management view
router.get("/", invController.buildManagementView);

// Route to build the add new classification view
router.get(
    "/type", 
    authorisationMiddleware,
    invController.buildAddClassification);
// Route to handle the add new classification form submission
router.post(
    "/type", 
    authorisationMiddleware,
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Route to build the add new vehicle view
router.get(
    "/detail", 
    authorisationMiddleware,
    invController.buildAddVehicle);
// Route to handle the add new vehicle form submission
router.post(
    "/detail",
    authorisationMiddleware,
    invValidate.vehicleRules(),
    invValidate.checkVehicleData,
    utilities.handleErrors(invController.addVehicle)
);

// Route to build the management vehicle view classification table
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));


// Route to build the view of the update a vehicle or inventory
router.get(
    "/edit/:singleId", 
    authorisationMiddleware,
    utilities.handleErrors(invController.buildUpdateVehicle));
// Route to  handle update a vehicle or inventory
router.post(
    "/update/", 
    authorisationMiddleware,
    invValidate.vehicleRules(),
    invValidate.checkUpdateVehicleData,
    utilities.handleErrors(invController.updateInventory))

// Route to build the view of the delete a vehicle or inventory
router.get(
    "/delete/:singleId", 
    authorisationMiddleware,
    utilities.handleErrors(invController.buildDeleteVehicle));
// Route to handle the delete a vehicle or inventory
router.post(
    "/delete/", 
    authorisationMiddleware,
    utilities.handleErrors(invController.deleteInventory));

module.exports = router;