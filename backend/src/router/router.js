const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passwordMiddleware = require ('../middleware/password');
const asyncHandler = require('express-async-handler')


router.use('/registration', 
  passwordMiddleware.hashPass,
  asyncHandler(userController.registrationUser));
  
router.use('/login', 
  asyncHandler(userController.loginUser));

router.use('/getUser', 
  asyncHandler(userController.getUser));

module.exports = router;