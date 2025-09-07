const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  event_id: { type: String, required: true, unique: true },
  account_id: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
  destination_id: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
  received_timestamp: { type: Date },
  processed_timestamp: { type: Date },
  received_data: { type: Object },
  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" }
});

module.exports = mongoose.model("Log", LogSchema);