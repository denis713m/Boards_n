import {takeLatest, takeLeading, takeEvery} from 'redux-saga/effects';
import * as types from '../actionTypes';
import {registrationUser, login, getUser} from './userSaga';
import {createBoards, getBoards, getBoardById, renameBoard, deleteBoard} from './boardsSaga';
import {createList, deleteList, renameList} from './listsSaga';

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
  }
  
  export default rootSaga;