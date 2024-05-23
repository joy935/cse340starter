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
    // (req, res) => {
    //     res.status(200).send('login process')
    //   } remove this arrow function
    utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;