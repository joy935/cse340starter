const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
* New Classification Data Validation Rules
* ********************************* */
validate.classificationRules = () => {
return [
    // classification name is required and must be string
    body("classification_name")
    .trim()
    .escape()
    .notEmpty().withMessage("A valid classification name is required.")
    .isAlpha().withMessage("A valid classification name is required.")
    .isLength({ min: 1 })
    .withMessage("A valid classification name is required.") // on error this message is sent.
    .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(classification_name)
        if (classificationExists){
            throw new Error("Classification exists. Please use different classification name")
        }
    })
]
}

/* ******************************
* Check data and return errors or continue to vehicle management
* ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/*  **********************************
* New Vehicle Data Validation Rules
* ********************************* */
validate.vehicleRules = () => {
return [
    body("classification_id")
    .notEmpty()
    .withMessage("Classification name is required."),
    
    body("inv_make")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("A valid make is required."), 

    body("inv_model")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("A valid model is required."),
    
    body("inv_description")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("A valid description is required."),
    
    body("inv_image")
    .notEmpty()
    .withMessage("A valid image path is required."),
    
    body("inv_thumbnail")
    .notEmpty()
    .withMessage("A valid thumbnail path is required."),
    
    body("inv_price")
    .isNumeric()
    .isLength({ min: 3, max: 7 })
    .withMessage("A valid price is required."),

    body("inv_year")
    .isNumeric()
    .isLength({ min: 4, max: 4 })
    .withMessage("A valid year is required."),

    body("inv_miles")
    .isNumeric()
    .withMessage("Valid miles is required."),
        
    body("inv_color")
    .isAlpha()
    .withMessage("A valid color is required.")
]
  }

/*  **********************************
 *  Check data and return errors or continue the vehicle processing
 * ********************************* */   
validate.checkVehicleData = async (req, res, next) => {
    const {
      classification_id, inv_make,
      inv_model, inv_description,
      inv_image, inv_thumbnail,
      inv_price, inv_miles,
      inv_year, inv_color,
    } = req.body;

    let classificationList = await utilities.buildClassificationList(classification_id)
    
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
          errors,
          title: "Add New Vehicle",
          classificationList,
          nav,
          classification_id, inv_make,
          inv_model, inv_description,
          inv_image, inv_thumbnail,
          inv_price, inv_miles,
          inv_year, inv_color,
        })
        return
      }
      next()
    }

/*  **********************************
 *  Check inventory data and return errors or continue the vehicle processing
 * ********************************* */   
validate.checkUpdateVehicleData = async (req, res, next) => {
    const {
      classification_id, inv_make,
      inv_model, inv_description,
      inv_image, inv_thumbnail,
      inv_price, inv_miles,
      inv_year, inv_color,
    } = req.body;

    const vehiculeName = `${inv_make} ${inv_model}`
    let classificationList = await utilities.buildClassificationList(classification_id)
    
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        
        let nav = await utilities.getNav()
        res.render("inventory/edit-inventory", {
          errors,
          title: "Edit " + vehiculeName,
          classificationList,
          nav,
          classification_id, inv_make,
          inv_model, inv_description,
          inv_image, inv_thumbnail,
          inv_price, inv_miles,
          inv_year, inv_color,
          inv_id,
        })
        return
      }
      next()
    }

module.exports = validate;