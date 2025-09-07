const mongoose = require("mongoose");
const crypto = require("crypto")

const UserSchema = new mongoose.Schema({
  email : { type: String, required: true,unique: true },
  hash:{type: String},
  salt:{type: String}
}, { timestamps: true });

UserSchema.methods.setPassword = function (password = "demo") {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function (password = "demo", salt, hashval) {
  var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hashval === hash;
};

module.exports = mongoose.model("User", UserSchema);