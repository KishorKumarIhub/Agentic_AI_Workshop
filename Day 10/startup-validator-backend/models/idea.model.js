const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title:     { type: String, required: true },
  evaluation:{ type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Idea", ideaSchema);
