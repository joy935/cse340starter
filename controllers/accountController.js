const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { parse } = require("dotenv")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }
  
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }
  
/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult.rowCount > 0) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return;
  }

  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600})

   // Store account data in session
   req.session.accountData = accountData;

   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/management")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

/* ****************************************
* Account Management View 
* *************************************** */
async function buildAccounManagement(req, res) {
  let nav = await utilities.getNav()
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
* Build Update Account View
* *************************************** */
async function buildUpdateAccount(req, res) {
  let nav = await utilities.getNav()
  const accountId = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountByAccountId(accountId)
  res.render("account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id : accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname : accountData.account_lastname,
    account_email : accountData.account_email,
  })
}

/* ****************************************
* Process Update Account Data
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  // const accountId = parseInt(req.body.account_id)
  const resultAccount = await accountModel.updateAccount( account_firstname, account_lastname, account_email, account_id,)
  const accountData = await accountModel.getAccountByAccountId(account_id)
  
  if (resultAccount) {
    try {
      // const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      // res.cookie("jwt", acccessToken, { httpOnly: true, maxAge: 3600 * 1000 })

        // Remove sensitive data before signing the JWT token
        // delete accountData.account_password;
        // const accessToken = jwt2.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
  
        // // Setting cookie with JWT token
        // if (process.env.NODE_ENV === 'development') {
        //   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
        // } else {
        //   res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
        // }
      // Update session data
      req.session.account = accountData;
      req.flash("notice", "Congratulations, your information has been updated.")
      return res.redirect("/account/management")

    } catch (error) {
      req.flash("notice", "Error updating account. Please try again.");
      return res.status(403).redirect("/account/update/" + accountData.account_id);
    }
  } else {
    req.flash("notice", "Account update failed.")
    const accountId = parseInt(req.params.account_id)
    const accountData = await accountModel.getAccountByAccountId(accountId)
    res.status(501).render("account/update/" + accountData.account_id, {
      title: "Edit Account",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id: accountData.account_id,
    })
  }
}
 
/* ****************************************
* Process Update Password Account
* *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password, account_id } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password update.')
    res.status(500).render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  }

  const accountId = parseInt(req.body.account_id)
  const accountData = await accountModel.getAccountByAccountId(accountId)
  const resultData = await accountModel.updatePassword(hashedPassword, accountId)

  if (resultData) {
    req.flash("notice", "Congratulations, your password has been updated.")
    res.redirect("/account/management") 
  } else {
    req.flash("notice", "Password update failed.")
    res.status(501).render("account/update/" + accountData.account_id, {
      title: "Edit Account",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname : accountData.account_lastname,
      account_email : accountData.account_email,
      account_id : accountData.account_id
    })
  }
}

/* ****************************************
 *  Process logout request
* ************************************ */
async function logout(req, res) {
  try {
    res.clearCookie("jwt")
    req.flash("notice", "You have been logged out.")
    res.redirect("/")
  } catch (error) {
    req.flash("notice", "Error logging out.")
    res.redirect("/")
  }
}

/* ****************************************
* Build Wishlist View
* *************************************** */
async function buildWishlist(req, res) {
  let nav = await utilities.getNav()

  const accountId = parseInt(req.params.account_id)

  const wishlistData = await accountModel.getWishlist(accountId)
  const wishlist = await utilities.displayWishlist(wishlistData)
  res.render("account/wishlist", {
    title: "Wishlist",
    nav,
    errors: null,
    wishlist,
  })
}

/* ****************************************
* Add to Wishlist
* *************************************** */
async function addToWishlist(req, res) {
  const { account_id, inv_id, wishlist_date } = req.body
  const result = await accountModel.addToWishlist(account_id, inv_id, wishlist_date)
  if (result) {
    req.flash("notice", "Inventory added to wishlist.")
    res.redirect("/account/wishlist/" + account_id)
  } else {
    req.flash("notice", "Inventory not added to wishlist.")
    res.redirect("/account/wishlist/" + account_id)
  }
}
/* ****************************************
* Delete from Wishlist
* *************************************** */
async function deleteFromWishlist(req, res) {
  const { wishlist_id} = req.body

  const account_id = parseInt(req.body.account_id)
  const wishlistData = await accountModel.getWishlistByWishlistId(wishlist_id)
  const result = await accountModel.deleteFromWishlist(wishlist_id)
  
  if (result) {
    req.flash("notice", "Inventory was successfully deleted from wishlist.")
    res.redirect("/account/wishlist/" + wishlistData.account_id)
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect("/account/wishlist/" + wishlistDataaccount_id)
  }
}

  module.exports = { 
    buildLogin, accountLogin,
    buildRegister, registerAccount, 
    buildAccounManagement, 
    buildUpdateAccount, updateAccount,
    updatePassword, logout,
    buildWishlist, addToWishlist, deleteFromWishlist }