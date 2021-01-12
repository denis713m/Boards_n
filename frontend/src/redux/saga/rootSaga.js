import { takeLatest, takeEvery } from 'redux-saga/effects';
import * as types from '../actionTypes';
import { registrationUser, login, getUser } from './userSagaStorage';
import { createBoards, getBoards, getBoardById, renameBoard, deleteBoard } from './boardsSaga';
import { createList, deleteList, renameList } from './listsSaga';
import { createCard, deleteCard, createComment, addDescription, replaceCard, replaceCardInList } from './cardsSaga';

function* rootSaga() {
    yield takeLatest(types.REGISTRATION_USER, registrationUser);
    yield takeLatest(types.LOGIN_USER, login);
    yield takeLatest(types.GET_USER, getUser);
    yield takeLatest(types.BOARD_CREATE, createBoards);
    yield takeLatest(types.GET_BOARDS, getBoards);
    yield takeLatest(types.GET_BOARD_BY_ID, getBoardById);
    yield takeLatest(types.BOARD_RENAME, renameBoard);
    yield takeLatest(types.BOARD_DELETE, deleteBoard);
    yield takeLatest(types.LIST_CREATE, createList);
    yield takeLatest(types.LIST_DELETE, deleteList);
    yield takeLatest(types.LIST_RENAME, renameList);
    yield takeLatest(types.CARD_CREATE, createCard);
    yield takeLatest(types.CARD_DELETE, deleteCard);
    yield takeEvery(types.CREATE_COMMENT, createComment);
    yield takeLatest(types.CARD_ADD_DESCRIPTION, addDescription);
    yield takeEvery(types.CARD_REPLACE, replaceCard);
    yield takeEvery(types.CARD_REPLACE_IN_LIST, replaceCardInList);
}

export default rootSaga;
