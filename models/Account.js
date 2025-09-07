const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  account_id : {type: String, required: true,unique:true},
  account_name: { type: String, required: true },
  app_secret_token: { type: String, required: true, unique: true },
  website: { type: String },
  created_by: { type: String, required: true },
  updated_by: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Account", AccountSchema);
