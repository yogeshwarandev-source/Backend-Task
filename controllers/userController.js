const {sendError,sendSuccess} = require("../helper/responseHandler.js")
const User = require("../models/User.js")
const validateData = require("../validator/validator.js")
const generateJwt = require("../middleware/Authmiddleware.js")


const Adduser = async(req,res)=> {
    try {
       const body = req.body;
       const validation = await validateData(body, 'Adduser')
      if (!validation.status) return sendError(req, res,validation.data)

        const existData = await User.findOne({email:req.body.email}).lean().exec()
        if(existData) throw new Error("EMAIL ALREDAY EXIST")

        const newUser = new User({
            email: req.body.email
                  });
        newUser.setPassword(body.password)
        const user = await newUser.save();
        user.hash = delete user.hash;
        user.salt = delete user.salt;
        const tokenData = {
            email: req.body.email,
            role: "USER"
        }
      const loginToken = await generateJwt(tokenData);
      return sendSuccess(
        req,
        res,
        'ADDUSER'
      )({ message: 'USER ADDED', user: user, token: loginToken })
        
    } catch (error) {
        return sendError(req, res, error)
    }
}

const login = async(req,res)=> {
  try {
       const body = req.body;
       console.log("body",body);
       
       const validation = await validateData(body, 'login')
      if (!validation.status) return sendError(req, res,validation.data)
        const Account = await User.findOne({email:req.body.email}).lean().exec()
        if(!Account) throw new Error("ACCOUNT NOT FOUND")
          const newDoc = User()
          const checkpassword = newDoc.validPassword(req.body.password,Account.salt,Account.hash)
          if(!checkpassword) throw new Error("INCORRECT PASSWORD")
        Account.hash = delete Account.hash;
        Account.salt = delete Account.salt;
          const tokenData = {
            email: req.body.email,
            role: "USER"
        }
      const loginToken = await generateJwt(tokenData);
      return sendSuccess(
        req,
        res,
        'loginuser'
      )({ message: 'Login Success', user: Account, token: loginToken })
          
  } catch (error) {
    return sendError(req, res, error)
  }
}


module.exports = {Adduser,login}

