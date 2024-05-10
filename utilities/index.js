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
* Build the single view HTML
* ************************************ */
Util.buildSingleView = async function(vehicle){
  let single = '';
  if(vehicle) {
  single = '<div id="single-display">'
    single += '<img class="single-img" src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors" />'
    single += '<div class="single-box">'
      single += '<div class="single-details">'
          single += '<p class="emphisize"><strong>Make:</strong> ' + vehicle.inv_make + '</p>'
        single += '<p class="emphisize"><strong>Model:</strong> ' + vehicle.inv_model + '</p>'
        single += '<p><strong>Year:</strong> ' + vehicle.inv_year + '</p>'
        single += '<p><strong>Price:</strong> $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
      single += '</div>'
      single += '<div class="single-description">'
        single += '<h2>Vehicle Description</h2>'
        single += '<p><strong>Description:</strong> ' + vehicle.inv_description + '</p>'
        single += '<p><strong>Miles:</strong> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
        single += '<p><strong>Color:</strong> ' + vehicle.inv_color + '</p>'
      single += '</div>'  
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