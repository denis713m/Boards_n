const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const boardController = require('../controllers/boardController');
const listController = require('../controllers/listController');
const cardController = require('../controllers/cardController');
const passwordMiddleware = require('../middleware/password');
const asyncHandler = require('../middleware/asyncHandler');
const checkToken = require('../middleware/tokenMiddleware');

router.post('/registration', passwordMiddleware.hashPass, asyncHandler(userController.registrationUser));

router.post('/login', asyncHandler(userController.loginUser));

router.use(asyncHandler(checkToken.checkToken));
router.post('/getUser', asyncHandler(userController.getUser));
router.post('/createBoard', asyncHandler(boardController.createBoard));
router.post('/deleteBoard', asyncHandler(boardController.deleteBoard));
router.post('/getAllBoards', asyncHandler(boardController.getAllBoards));
router.post('/renameBoard', asyncHandler(boardController.renameBoard));
router.post('/getBoardById', asyncHandler(boardController.getBoardById));
router.post('/createList', asyncHandler(listController.createList));
router.post('/renameList', asyncHandler(listController.renameList));
router.post('/deleteList', asyncHandler(listController.deleteList));
router.post('/createCard', asyncHandler(cardController.createCard));
router.post('/deleteCard', asyncHandler(cardController.deleteCard));
router.post('/addDescription', asyncHandler(cardController.addDescription));
router.post('/replaceCardInList', asyncHandler(cardController.replaceCardInList));
router.post('/replaceCard', asyncHandler(cardController.replaceCard));
router.post('/createComment', asyncHandler(cardController.createComment));

module.exports = router;
