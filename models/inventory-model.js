const { check } = require("express-validator")
const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get single inventory item by singleId
 * ************************** */
async function getVehiculeById(singleId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
      [singleId]
    );
  return data.rows[0];
  } catch (error) {
    console.error("getVehiculeById error " + error);
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Check for existing classification
* ************************** */
async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}

/* ***************************
* Get all classifications
* ************************** */
async function getClassifications(){
    return await pool.query(
      `SELECT * FROM public.classification 
      ORDER BY classification_name`)
  }

/* ***************************
* Add new vehicle or inventory
* ************************** */
async function addVehicle(classification_id, inv_make, 
  inv_model, inv_description, 
  inv_image, inv_thumbnail, 
  inv_price, inv_year, 
  inv_miles, inv_color){

  try {
    const sql = `INSERT INTO inventory (
      classification_id, inv_make, 
      inv_model, inv_description, 
      inv_image, inv_thumbnail, 
      inv_price, inv_year, 
      inv_miles, inv_color) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *`

    return await pool.query(sql,
      [classification_id, inv_make,
        inv_model, inv_description,
        inv_image, inv_thumbnail,
        inv_price, inv_year, inv_miles,
        inv_color])

  } catch (error) {
    return error.message
  }
}

/* ***************************
* Update vehicle or inventory data
* ************************** */
async function updateInventory(
  inv_id, inv_make, 
  inv_model, inv_description, 
  inv_image, inv_thumbnail, 
  inv_price, inv_year, 
  inv_miles, inv_color,
  classification_id, ){

  try {
    const sql = "UPDATE inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
* Update vehicle or inventory data
* ************************** */
async function deleteInventory(inv_id){

  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1"
    
    const data = await pool.query(sql, [inv_id])
    return data // a successful delete witll store "1", while a failure will store "0"
  } catch (error) {
    console.error("Delete Inventory Error: " + error)
  }
}

module.exports = {
  getClassifications, 
  getInventoryByClassificationId, getVehiculeById, 
  addClassification, checkExistingClassification, getClassifications, 
  addVehicle, 
  updateInventory, deleteInventory};