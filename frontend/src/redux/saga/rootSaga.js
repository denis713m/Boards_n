import {takeLatest, takeLeading, takeEvery} from 'redux-saga/effects';
import * as types from '../actionTypes';
import {registrationUser, login, getUser} from './userSaga';
import {createBoards, getBoards, getBoardById, renameBoard} from './boardsSaga';

function* rootSaga() {
    yield takeLatest(types.REGISTRATION_USER, registrationUser);
    yield takeLatest(types.LOGIN_USER, login);
    yield takeLatest(types.GET_USER, getUser);
    yield takeLatest(types.BOARD_CREATE, createBoards);
    yield takeLatest(types.GET_BOARDS, getBoards);
    yield takeLatest(types.GET_BOARD_BY_ID, getBoardById);
    yield takeLatest(types.BOARD_RENAME, renameBoard);
  }
  
  export default rootSaga;