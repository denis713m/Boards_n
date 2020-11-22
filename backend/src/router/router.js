const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passwordMiddleware = require ('../middleware/password');


router.use('/registration', 
  passwordMiddleware.hashPass,
  userController.registrationUser);
  
router.use('/login', 
  userController.loginUser);

router.use('/getUser', 
  userController.getUser);

module.exports = router;