--Query 1: INSERT Tony Stark record to the account table
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
	VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Query 2: UPDATE the Tony Stark record account_type to "Admin"
UPDATE account
	SET account_type = 'Admin'
	WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Query 3: DELETE the Tony Stark record from the database
DELETE FROM account
	WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Query 4: UPDATE the GM Hummer description
UPDATE inventory
	SET inv_description = REPLACE('Do you have 6 kids and like to go offroading? The Hummer gives you the small interiors with an engine to get you out of any muddy or rocky situation.', 'the small interiors', 'a huge interior')
	WHERE inv_make = 'GM';

-- Query 5: Use an INNER JOIN to select the make and model fields from the inventory table and the classification name field from the classification table for inventory items that belong to the "Sport" category.
SELECT inv_make, inv_model 
	FROM inventory i
	JOIN classification c
		ON i.classification_id = c.classification_id
	WHERE classification_name = 'Sport';

-- Query 6: UPDATE all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail columns
UPDATE inventory 
	SET 
		inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
	WHERE inv_image LIKE '/images/%.jpg'
  	AND inv_thumbnail LIKE '/images/%-tn.jpg';
