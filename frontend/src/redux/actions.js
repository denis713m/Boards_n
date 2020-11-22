import * as types from './actionTypes';

export const registerUser = userInfo => ({
    type: types.REGISTRATION_USER,
    data: userInfo
})

export const login = userInfo => ({
    type: types.LOGIN_USER,
    data: userInfo
})

export const getUser = () => ({
    type: types.GET_USER    
})

export const logOut = () => ({
    type: types.LOG_OUT
})

export const boardCreate = data => ({
    type: types.BOARD_CREATE,
    data: data
})

export const boardDeelete = data => ({
    type: types.BOARD_DELETE,
    data: data
})

export const boardRename = data => ({
    type: types.BOARD_RENAME,
    data: data
})

export const getBoards = data => ({
    type: types.GET_BOARDS,
    data: data
})

export const getBoardById = data => ({
    type: types.GET_BOARD_BY_ID,
    data: data
})