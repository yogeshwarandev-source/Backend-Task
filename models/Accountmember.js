const mongoose = require("mongoose");

const AccountmemberSchema = new mongoose.Schema({
  account_id : { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true  },
  user_id:{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role_id: {type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true},
  created_by: { type: Date, required: true },
  updated_by: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Accountmember", AccountmemberSchema);