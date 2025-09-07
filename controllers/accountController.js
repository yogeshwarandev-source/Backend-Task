const Account = require("../models/Account.js")
const { v4: uuidv4 } = require('uuid');
const {sendError,sendSuccess} = require("../helper/responseHandler.js")
const validateData = require("../validator/validator.js")
const crypto = require("crypto");
const generateJwt = require("../middleware/Authmiddleware.js")


function generateappToken() {
  return crypto.randomBytes(32).toString("hex");
}



const Addaccount = async(req,res)=> {
    try {
        const body = req.body;
        const validation = await validateData(body, 'addaccount')
      if (!validation.status) return sendError(req, res,validation.data)

        const existData = await Account.findOne({account_name :req.body.account_name}).lean().exec()
        if(existData) throw new Error("ACCOUNT ALREDAY EXIST")
        const accId = uuidv4()
        const Token = generateappToken()
        const newUser = new Account({
            account_id : uuidv4(),
            account_name: req.body.account_name,
            app_secret_token: Token,
            website: req.body.website,
            created_by: req.body.created_by,
            updated_by :req.body.updated_by
        });
        const user = await newUser.save()
        const tokenData = {
            account_id: accId,
            app_secret_token: Token,
            account_name: req.body.account_name
        }
      const loginToken = await generateJwt(tokenData);
       return sendSuccess(
        req,
        res,
        'ADDACCOUNT'
      )({ message: 'ACCOUNT ADDED', user: user, token: loginToken })
    } catch (error) {
        return sendError(req, res, error)

    }
}

const Updateaccount = async(req,res)=> {
    try {
        const body = req.body;
        const validation = await validateData(body, 'updateaccount')
      if (!validation.status) return sendError(req, res,validation.data)

        const existData = await Account.findOne({account_id :req.body.account_id }).lean().exec()
        if(existData) throw new Error("ACCOUNT NOT FOUND")
            const updateObj = {
            account_id : existData.account_id,
            app_secret_token :existData.app_secret_token, 
            account_name: req.body.account_name || existData.account_name,
            website: req.body.website || existData.website,
            created_by: req.body.created_by || existData.created_by,
            updated_by :req.body.updated_by || existData.updated_by,

            }
            const UpdateData = await Account.findByIdAndUpdate({account_id:existData.account_id},updateObj).lean().exec()
        const tokenData = {
            account_id: accId,
            app_secret_token: Token,
            account_name: req.body.account_name
        }
      const loginToken = await generateJwt(tokenData);
       return sendSuccess(
        req,
        res,
        'ADDACCOUNT'
      )({ message: 'ACCOUNT ADDED', user: UpdateData, token: loginToken })
    } catch (error) {
        return sendError(req, res, error)

    }
}



module.exports = {Addaccount, Updateaccount}