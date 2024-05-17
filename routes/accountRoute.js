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
    // utilities.handleErrors(accountController.loginAccount),
    (req, res) => {
        res.status(200).send('login process')
      }
)

module.exports = router;