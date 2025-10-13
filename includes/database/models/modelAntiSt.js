const mongoose = require("mongoose");

const AntiStSchema = new mongoose.Schema({
  threadID: { type: String, required: true, unique: true },
  data: { type: Object, default: {} }
});

module.exports = mongoose.models.modelAntiSt || mongoose.model("modelAntiSt", AntiStSchema);
