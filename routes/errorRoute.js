// Needed Resources 
const express = require("express")
const router = new express.Router() 
const errController = require("../controllers/errController")

// Route to generate an error in the footer
router.get("/broken-link", errController.generateError);