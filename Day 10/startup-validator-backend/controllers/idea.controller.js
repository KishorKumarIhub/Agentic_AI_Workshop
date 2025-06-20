const Idea = require("../models/idea.model");

const axios = require("axios");


exports.validateIdeaWithAI = async (req, res) => {
  const { title} = req.body;

  try {
  console.log("calling  api:",req.params.userId);
  
    const response = await axios.post("http://localhost:8000/validate-idea", {
        startup_idea: title,
      
    });

    const evaluation = response.data;

    // Save the idea with evaluation and user id
    const idea = await Idea.create({
      user: req.params.userId,
      title,
      evaluation
    });

    res.json({ idea });
  } catch (error) {
    console.error("Error communicating with Python:", error.message);
    res.status(500).json({ msg: "Python AI evaluation failed" });
  }
};

exports.getUserIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
