const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema({
  account_id: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
  url: { type: String, required: true },
  http_method: { type: String, required: true },
  headers: { type: Object, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Destination", DestinationSchema);
