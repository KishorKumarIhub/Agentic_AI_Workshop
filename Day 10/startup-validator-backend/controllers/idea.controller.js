const Idea = require("../models/idea.model");

const axios = require("axios");


exports.validateIdeaWithAI = async (req, res) => {
  const { idea, industry, regions, technologies } = req.body;

  try {
    console.log("calling  api:", req.params.userId);

    const response = await axios.post("http://localhost:8000/analyze-startup", {
      idea,
      industry,
      regions,
      technologies
    });

    const evaluation = response.data;

    // Save the idea with evaluation and user id
    const newIdea = await Idea.create({
      user: req.params.userId,
      idea,
      industry,
      regions,
      technologies,
      evaluation
    });

    res.json({ idea: newIdea });
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

exports.getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.ideaId);
    
    
    if (!idea) {
      return res.status(404).json({ msg: "Idea not found" });
    }
    
    res.json(idea);
  } catch (err) {
    console.log("Error:",err);
    
    res.status(500).json({ msg: "Server error" });
  }
};
