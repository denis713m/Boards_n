import * as types from '../actionTypes';
import { put } from 'redux-saga/effects';
import { v4 as uuidv4 } from 'uuid';
import {getBoardsFromStorage} from '../../utils/functions';

export function* createBoards(action) {
    yield put({type: types.BOARD_REQUEST});
    try{
        const boards = getBoardsFromStorage();
        boards.forEach(element => {
            if (element.name === action.payload.name) throw new Error('Wrong name');
        });
        const board = {name:action.payload.name, user: action.payload.user, id:uuidv4()}
        boards.push(board);
        window.localStorage.setItem('boards', JSON.stringify(boards));
        yield put({type: types.BOARD_CREATE_SUCCESS, data: board});
    }
    catch (e) {
        yield put({type: types.BOARD_OPERATION_ERROR, error: e});
    }
 };

 export function* getBoards(action) {
    yield put({type: types.BOARD_REQUEST});
    try{
        const boards = getBoardsFromStorage();
        yield put({type: types.GET_BOARDS_SUCCESS, data:boards});
    }
    catch (e) {
        yield put({type: types.BOARD_OPERATION_ERROR, error: e.response});
    }
 }

 export function* getBoardById(action) {
    yield put({type: types.BOARD_REQUEST});
    try{
        const boards = getBoardsFromStorage();    
        let board=null;
        boards.forEach(element => {
            if (element.id === action.payload) board=element;
        })
        if(!board) throw new Error('Board_absend');
        yield put({type: types.GET_BOARD_BY_ID_SUCCESS, data:board});
    }
    catch (e) {
        yield put({type: types.BOARD_OPERATION_ERROR, error: e.response});
    }
 }

 export function* renameBoard(action) {
    yield put({type: types.BOARD_REQUEST});
    try{
        const boards = getBoardsFromStorage();    
        boards.forEach(element => {
            if (element.id === action.payload.id) {
                    element.name = action.payload.name;}
        }) 
        window.localStorage.setItem('boards', JSON.stringify(boards));    
        yield put({type: types.BOARD_RENAME_SUCCESS, data:{newName:action.payload.name,
                                                            boards:boards}});
    }
    catch (e) {
        yield put({type: types.BOARD_OPERATION_ERROR, error: e.response});
    }
 }