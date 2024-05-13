// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/errController")

// Route to generate an error in the footer
router.get("/broken-link", errController.generateError);
