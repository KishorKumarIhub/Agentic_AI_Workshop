const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  idea:      { type: String, required: true },
  industry:  { type: String, required: true },
  regions:    { type: [String], required: true },
  technologies: { type: [String], required: true },
  evaluation:{ type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Idea", ideaSchema);
