import * as types from './actionTypes';
import { createAction } from 'redux-actions';

export const registerUser =createAction(types.REGISTRATION_USER)

export const login = createAction(types.LOGIN_USER)

export const getUser = createAction(types.GET_USER)

export const logOut = createAction(types.LOG_OUT)

export const boardCreate = createAction(types.BOARD_CREATE)

export const boardDeelete = createAction(types.BOARD_DELETE)

export const boardRename = createAction(types.BOARD_RENAME)

export const getBoards = createAction(types.GET_BOARDS)

export const getBoardById = createAction(types.GET_BOARD_BY_ID)