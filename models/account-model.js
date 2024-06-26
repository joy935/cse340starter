const pool = require("../database/");

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Get account data using account_id
* ***************************** */
async function getAccountByAccountId (account_id) {
  try {
    const data = await pool.query(
      `SELECT account_id, account_firstname,account_lastname, account_email 
      FROM account 
      WHERE account_id = $1`, 
      [account_id]
    )
      return data.rows[0] // or data.rows
  } catch(error) {
    return new Error("getAccountByAccountId error: " + error)
  }
}

/* *****************************
* Update account data
* ***************************** */
async function updateAccount(
  account_firstname, 
  account_lastname, 
  account_email, 
  account_id) {

  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    const data =  await pool.query(sql, [
      account_firstname, 
      account_lastname, 
      account_email, 
      account_id
    ])
    return data.rows[0]
  } catch(error) {
    console.log("model error: " + error )
  }
  }

/* *****************************
* Update account password
* ***************************** */
async function updatePassword (
  account_password, 
  account_id) {

  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    
    const data = await pool.query(sql, [
      account_password, 
      account_id])
    return data.rows[0]
  } catch(error) {
    console.log("model error: " + error)
  }
}

/* *****************************
* Get wishlist data (performed a join with inventory table)
* ***************************** */
async function getWishlist(account_id) {
  try {
    const sql = `
      SELECT wishlist.wishlist_id, wishlist.inv_id, inventory.inv_make, inventory.inv_model
      FROM wishlist
      INNER JOIN inventory ON wishlist.inv_id = inventory.inv_id
      WHERE wishlist.account_id = $1
    `;
    
    const data = await pool.query(sql, [account_id]);
    return data.rows;
  } catch (error) {
    console.error("Error fetching wishlist: ", error);
  }
}

/* *****************************
* Add to wishlist
* ***************************** */
async function addToWishlist(account_id, inv_id, wishlist_date) {
  try {
    const sql = "INSERT INTO wishlist (account_id, inv_id, wishlist_date) VALUES ($1, $2, $3) RETURNING *";
    const data = await pool.query(sql, [account_id, inv_id, wishlist_date]);
    return data.rows[0];
  } catch (error) {
    console.error("Error adding to wishlist: ", error);
  }
}
/* ***************************
* Get wishlist by account_id and inv_id
* ************************** */
async function getWishlistByWishlistId(wishlist_id) {
  try {
    const sql = "SELECT * FROM wishlist WHERE wishlist_id = $1";
    const data = await pool.query(sql, [wishlist_id]);
    return data.rows[0];
  } catch (error) {
    console.error("Error fetching wishlist: ", error);
  }
}

/* *****************************
* Remove from wishlist
* ***************************** */
async function deleteFromWishlist(wishlist_id) {
  try {
    const sql = "DELETE FROM wishlist WHERE wishlist_id = $1";
    const data = await pool.query(sql, [wishlist_id]);
    return data;  // return true if deleted
  } catch (error) {
    console.error("Error removing from wishlist: ", error);
  }
}

module.exports = {
  registerAccount, checkExistingEmail, 
  getAccountByEmail, getAccountByAccountId,
  updateAccount, updatePassword,
  getWishlist, addToWishlist, 
  getWishlistByWishlistId, deleteFromWishlist };