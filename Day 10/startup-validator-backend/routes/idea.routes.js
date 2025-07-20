const express = require("express"); 
const { getUserIdeas, validateIdeaWithAI, getIdeaById } = require("../controllers/idea.controller"); // Import controller functions for ideas
const auth = require("../middlewares/auth.middleware"); // Import authentication middleware

const router = express.Router(); // Create a new router instance

router.get("/:userId", auth, getUserIdeas);

router.get("/idea/:ideaId", auth,  getIdeaById);

router.post("/validate/:userId", auth, validateIdeaWithAI);

module.exports = router; // Export the router for use in server.js

