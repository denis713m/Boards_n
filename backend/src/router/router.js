const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const asyncHandler = require('../middleware/asyncHandler');

router.use('/registration', asyncHandler(userController.registrationUser));

router.use('/login', asyncHandler(userController.loginUser));

router.use('/getUser', asyncHandler(userController.getUser));

module.exports = router;