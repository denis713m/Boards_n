import * as types from '../actionTypes';
import { put } from 'redux-saga/effects';
import { v4 as uuidv4 } from 'uuid';

export function* createBoards(action) {
    yield put({type: types.BOARD_REQUEST});
    try{
        let boards = window.localStorage.getItem('boards');
        if(!boards) boards= [];
        else boards = JSON.parse(boards);
        boards.forEach(element => {
            if (element.name === action.data.name) throw new Error('Wrong name');
        });
        const board = {name:action.data.name, user: action.data.user, id:uuidv4()}
        boards.push(board);
        window.localStorage.setItem('boards', JSON.stringify(boards));
        //action.data.history.replace('/');
        yield put({type: types.BOARD_CREATE_SUCCESS, data: board});
    }
    catch (e) {
        console.log(e);
        yield put({type: types.BOARD_OPERATION_ERROR, error: e});
    }
 };

 export function* getBoards(action) {
    yield put({type: types.BOARD_REQUEST});
    try{
        console.log('getBoards');
        let boards = window.localStorage.getItem('boards');
        if(!boards) boards= [];
        else boards = JSON.parse(boards);       
        console.log(boards);
        yield put({type: types.GET_BOARDS_SUCCESS, data:boards});
    }
    catch (e) {
        yield put({type: types.BOARD_OPERATION_ERROR, error: e.response});
    }
 }

 export function* getBoardById(action) {
    yield put({type: types.BOARD_REQUEST});
    try{
        console.log('getBoards_by_id');
        let boards = window.localStorage.getItem('boards');
        boards = JSON.parse(boards);       
        let board={}
        console.log(boards);
        boards.forEach(element => {
            if (element.id === action.data) board=element;
        })
        console.log(action.data)
        if(!board) throw new Error('Board_absend');
        console.log(board);
        yield put({type: types.GET_BOARD_BY_ID_SUCCESS, data:board});
    }
    catch (e) {
        console.log(e);
        yield put({type: types.BOARD_OPERATION_ERROR, error: e.response});
    }
 }

 export function* renameBoard(action) {
    yield put({type: types.BOARD_REQUEST});
    try{
        console.log('rename board');
        let boards = window.localStorage.getItem('boards');
        boards = JSON.parse(boards); 
   
        boards.forEach(element => {
            if (element.id === action.data.id) {
                    element.name = action.data.name;}
        }) 
        console.log(boards)   ;
        window.localStorage.setItem('boards', JSON.stringify(boards));    
        yield put({type: types.BOARD_RENAME_SUCCESS, data:{newName:action.data.name,
                                                            boards:boards}});
    }
    catch (e) {
        console.log(e);
        yield put({type: types.BOARD_OPERATION_ERROR, error: e.response});
    }
 }