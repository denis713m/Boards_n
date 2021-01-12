import * as types from './actionTypes';
import { createAction } from 'redux-actions';

export const registerUser =createAction(types.REGISTRATION_USER)

export const login = createAction(types.LOGIN_USER)

export const getUser = createAction(types.GET_USER)

export const logOut = createAction(types.LOG_OUT)

export const boardCreate = createAction(types.BOARD_CREATE)

export const boardDelete = createAction(types.BOARD_DELETE)

export const boardRename = createAction(types.BOARD_RENAME)

export const getBoards = createAction(types.GET_BOARDS)

export const getBoardById = createAction(types.GET_BOARD_BY_ID)

export const listCreate = createAction(types.LIST_CREATE)

export const listDelete = createAction(types.LIST_DELETE)

export const listRename = createAction(types.LIST_RENAME)

export const getListByBoard = createAction(types.GET_LISTS_BY_BOARD)

export const cardCreate = createAction(types.CARD_CREATE)

export const cardDelete = createAction(types.CARD_DELETE)

export const chooseCard = createAction(types.CHOOSE_CARD)

export const createComment = createAction(types.CREATE_COMMENT)

export const addDescription = createAction(types.CARD_ADD_DESCRIPTION)

export const replaceCard = createAction(types.CARD_REPLACE)

export const replaceCardInList = createAction(types.CARD_REPLACE_IN_LIST);

export const clearErrors = createAction(types.CLEAR_ERRORS);