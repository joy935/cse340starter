const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")

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
  const singleView = await utilities.buildSingleView(vehicule)
  let nav = await utilities.getNav()
  if (!vehicule) {
    return res.status(404).send("Vehicle not found");
  }
  res.render("./inventory/detail", {
    title: vehicule.inv_make + " " + vehicule.inv_model,
    singleView,
    nav,
  });
}

/* ***************************
*  Build vehicle management view
* ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
  })
}

/* ***************************
*  Build add classification view
* ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
*  Process add new classification form submission
* ************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const result = await invModel.addClassification(
    classification_name
  )

  if (result.rowCount > 0) {
    req.flash(
      "notice",
      `The new ${classification_name} was successfully added.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicule Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, there was an error adding the classification.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

module.exports = invCont;