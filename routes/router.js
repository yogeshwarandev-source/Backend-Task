const express = require('express');
const router = express.Router();
const {Adduser,login} = require ("../controllers/userController.js")
const {Addaccount,Updateaccount} = require("../controllers/accountController.js")
const {handleIncomingData} = require("./controllers/dataHandlercontroller.js")



router.post("/User",Adduser)
router.post("/User/login",login)

router.post("/Account",Addaccount).put('/Account/update',handleIncomingData , Updateaccount)
     




module.exports = router;