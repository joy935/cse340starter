// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build the register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to handle the register form submission
router.post(
    "/register", 
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Route to handle the login form submission
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// Route to build the account management view
router.get(
    "/management", 
    utilities.handleErrors(accountController.buildAccounManagement))

// Route to build the update account view
router.get(
    "/update/:account_id",
    utilities.handleErrors(accountController.buildUpdateAccount)
)
// Route to handle the update account form submission
router.post(
    "/updateAccount",
    regValidate.updateRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
)
// Route to handle the update password form submission
router.post(
    "/updatePassword",
    regValidate.updatePasswordRules(),
    regValidate.checkUpdatePasswordData,
    utilities.handleErrors(accountController.updatePassword)
)

module.exports = router;