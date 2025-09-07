const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const RoleSchema = new mongoose.Schema({
    id: new ObjectId(),
    role_name: {type:String,required:true},
    created_by: { type: Date, required: true,default:null },
    updated_by: { type: Date, required: true,default:null }
}, { timestamps: true });

module.exports = mongoose.model("Role", RoleSchema);