const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<ul>'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += '<li>'
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li class="list-items">'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      // grid += '<hr />' removed this line
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildSingleView = async function(vehicle, accountData){
  let detail = '';
  if(vehicle) {
  detail = '<div id="single-display">'
    detail += '<img class="single-img" src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors" />'
    detail += '<div class="single-box">'
      detail += '<div class="single-details">'
          detail += '<p class="emphisize"><strong>Make:</strong> ' + vehicle.inv_make + '</p>'
        detail += '<p class="emphisize"><strong>Model:</strong> ' + vehicle.inv_model + '</p>'
        detail += '<p><strong>Year:</strong> ' + vehicle.inv_year + '</p>'
        detail += '<p><strong>Price:</strong> $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
      detail += '</div>'
      detail += '<div class="single-description">'
        detail += '<h2>Vehicle Description</h2>'
        detail += '<p><strong>Description:</strong> ' + vehicle.inv_description + '</p>'
        detail += '<p><strong>Miles:</strong> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
        detail += '<p><strong>Color:</strong> ' + vehicle.inv_color + '</p>'
      detail += '</div>'  
    detail += '</div>'
  detail += '</div>'
  detail += '<form action="/account/wishlist" method="POST" id="wishlistForm">'
  detail += '<input type="hidden" id="inv_id" name="inv_id" value="' + vehicle.inv_id + '">'
  detail += '<input type="hidden" id="account_id" name="account_id" value="' + accountData.account_id + '">'

  // Format the date as "YYYY-MM-DD HH:MM:SS"
  let currentDate = new Date();
  let formattedDate = currentDate.getFullYear() + "-" 
                    + String(currentDate.getMonth() + 1).padStart(2, '0') + "-" 
                    + String(currentDate.getDate()).padStart(2, '0') + " " 
                    + String(currentDate.getHours()).padStart(2, '0') + ":" 
                    + String(currentDate.getMinutes()).padStart(2, '0') + ":" 
                    + String(currentDate.getSeconds()).padStart(2, '0');

  detail += '<input type="hidden" id="wishlist_date" name="wishlist_date" value="' + formattedDate + '">'
  detail += '<button id="addWishlist" title="Add ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' to your wishlist">Add to Wishlist</button>'
  detail += '</form>'
} else {
  detail += '<p class="notice">Sorry, that vehicle could not be found.</p>'
}
return detail
}

/* **************************************
* Drop down list of classifications
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1 // means true
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 *  Build the wishlist list
 * ************************************ */
Util.displayWishlist = async function (data) {
  if (data.length === 0) {
    return 0; // no wishlist items
  }

  let wishlist = '<ul class="wishlist">'
  data.forEach((row) => {
    wishlist += '<li>'
    wishlist += '<a href="/inv/detail/' + row.inv_id + '" title="View ' + row.inv_make + ' ' + row.inv_model + ' details">'
    wishlist += row.inv_make + ' ' + row.inv_model + '</a>' 
    wishlist += '<form action="/account/wishlist/delete" method="POST" id="removeForm">'
    wishlist += '<input type="hidden" id="inv_id" name="inv_id" value="' + row.inv_id + '">'
    wishlist += '<input type="hidden" id="account_id" name="account_id" value="' + row.account_id + '">'
    wishlist += '<input type="hidden" id="wishlist_id" name="wishlist_id" value="' + row.wishlist_id + '">'
    wishlist += '<input type="hidden" id="wishlist_date" name="wishlist_date" value="' + row.wishlist_date + '">'
    wishlist += '<button type="submit" class="remove" title="Remove ' + row.inv_make + ' ' + row.inv_model + ' from your wishlist">Remove</button>'
    wishlist += '</form>'
    wishlist += '</li>'
  })
  wishlist += '</ul>'
  return wishlist
}

module.exports = Util;