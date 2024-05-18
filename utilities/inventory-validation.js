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
// validate.checkClassificationData = async (req, res, next) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//         let nav = await utilities.getNav()
//         res.render("./inventory/add-classification", {
//             title: "Add New Classification",
//             nav,
//         })
//     } else {
//         next()
//     }
// }

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

module.exports = validate