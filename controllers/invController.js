const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build single view for vehicle
 * ************************** */
invCont.buildBySingleId = async function (req, res, next) {
  const singleId = req.params.singleId
  const vehicule = await invModel.getVehiculeById(singleId);

  if (!vehicule) {
    return res.status(404).send("Vehicle not found");
  }

  res.render("./inventory/classification", {
    title: vehicule.inv_make + " " + vehicule.inv_model,
    vehicule,
  });
}

module.exports = invCont;