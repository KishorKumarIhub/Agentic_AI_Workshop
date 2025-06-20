

const express = require("express"); 
const { getUserIdeas , validateIdeaWithAI } = require("../controllers/idea.controller"); // Import controller functions for ideas
const auth = require("../middlewares/auth.middleware"); // Import authentication middleware

const router = express.Router(); // Create a new router instance


router.get("/:userId", auth, getUserIdeas);


router.post("/validate/:userId", auth, validateIdeaWithAI);

module.exports = router; // Export the router for use in server.js
