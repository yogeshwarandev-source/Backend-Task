const jwt = require("jsonwebtoken")


async function generateJwt(data) {
    const expiry = new Date()
    expiry.setDate(expiry.getDate() + 7) 
    return jwt.sign(data,"demo")
}



module.exports = generateJwt