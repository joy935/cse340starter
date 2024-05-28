const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
  const accountModel = require("../models/account-model")

/*  **********************************
*  Registration Data Validation Rules
* ********************************* */
validate.registationRules = () => {
return [
    // firstname is required and must be string
    body("account_firstname")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
    .trim() // sanitizing function to remove whitespace
    .escape() // finds any special characters and transforms them into HTML entities
    .notEmpty() // checks if the value exists
    .isLength({ min: 2 })
    .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail() // checks if the value is a valid email address
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),

    // password is required and must be strong password
    body("account_password")
    .trim()
    .notEmpty()
    .isStrongPassword({ // checks if the value meet specific requirements
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    .withMessage("Password does not meet requirements."),
]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Register",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

/*  **********************************
*  Login Data Validation Rules
* ********************************* */
validate.loginRules = () => {
  return [
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail() // checks if the value is a valid email address
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (!emailExists){
          throw new Error("You must register before logging in.")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({ // checks if the value meet specific requirements
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
  }
  
/* ******************************
  * Check data and return errors or continue to login
  * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
        errors,
        title: "Login",
        nav,
        account_email,
      })
      return
    }
    next()
  }

/*  **********************************
*  Update Data Validation Rules
* ********************************* */
validate.updateRules = () => {
  return [
      // firstname is required and must be string
      body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("A valid first name is required."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
      .trim() // sanitizing function to remove whitespace
      .escape() // finds any special characters and transforms them into HTML entities
      .notEmpty() // checks if the value exists
      .isLength({ min: 2 })
      .withMessage("A valid last name is required."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the database
      body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail() // checks if the value is a valid email address
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email, {req}) => {
          const accountId = parseInt(req.body.account_id)
          const accountData = await accountModel.getAccountByAccountId(accountId)
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (emailExists && accountData.account_email !== account_email){
            throw new Error("Email exists. Please use a different email")
          }
        }),
  ]
  }

/* ******************************
  * Check data and return errors or continue to update account info
  * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    let errors = []
    const accountId = parseInt(req.body.account_id)
    const accountData = await accountModel.getAccountByAccountId(accountId)
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/update", {
        errors,
        title: "Edit Account",
        nav,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_id: accountData.account_id,
      })
      return
    }
    next()
  }

/*  **********************************
*  Update Password Validation Rules
* ********************************* */
validate.updatePasswordRules = () => {
  return [
      // password is required and must be strong password
      body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({ // checks if the value meet specific requirements
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
  }

/* ******************************
  * Check data and return errors or continue to update password
  * ***************************** */
validate.checkUpdatePasswordData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_password, account_id } = req.body
    const accountId = parseInt(req.body.account_id)
    const accountData = await accountModel.getAccountByAccountId(accountId)
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/update", {
        errors,
        title: "Edit Account",
        nav,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_password: accountData.account_password,
        account_id: accountData.account_id,
      })
      return
    }
    next()
  }

  module.exports = validate