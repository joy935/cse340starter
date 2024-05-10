const invModel = require("../models/inventory-model")
const Util = {}

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


/* **************************************
* Build the single view HTML
* ************************************ */
Util.buildSingleView = async function(vehicle){
  let single = '';
  if(vehicle) {
  single = '<div id="single-display">'
    single += '<h2 id="title">' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h2>'
    single += '<img src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors" />'
    single += '<div class="single-details">'
        single += '<p><strong>Make:</strong> ' + vehicle.inv_make + '</p>'
      single += '<p><strong>Model:</strong> ' + vehicle.inv_model + '</p>'
      single += '<p><strong>Year:</strong> ' + vehicle.inv_year + '</p>'
      single += '<p><strong>Price:</strong> $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
    single += '</div>'
    single += '<div class="single-description">'
      single += '<h3>Vehicle Description</h3>'
      single += '<p>Description: ' + vehicle.inv_description + '</p>'
      single += '<p>Miles: ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
      single += '<p>Color: ' + vehicle.inv_color + '</p>'
    single += '</div>'  
  single += '</div>'
} else {
  single += '<p class="notice">Sorry, that vehicle could not be found.</p>'
}
return single
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util;