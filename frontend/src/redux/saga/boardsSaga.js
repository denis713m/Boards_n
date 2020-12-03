import * as types from '../actionTypes';
import { put } from 'redux-saga/effects';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import {
    getBoardsFromStorage,
    getListsFromStorageByBoard,
    getCardsFromStorageByBoard,
    getActivityFromStorageByBoard,
    deleteListByBoard,
} from '../../utils/storageFunctions';

export function* createBoards(action) {
    yield put({ type: types.BOARD_REQUEST });
    try {
        const boards = getBoardsFromStorage();
        boards.forEach((element) => {
            if (element.name === action.payload.name) throw new Error('Wrong name');
        });
        const board = {
            name: action.payload.name,
            user: action.payload.user,
            id: uuidv4(),
        };
        boards.push(board);
        window.localStorage.setItem('boards', JSON.stringify(boards));
        yield put({
            type: types.BOARD_CREATE_SUCCESS,
            data: board,
        });
    } catch (e) {
        yield put({
            type: types.BOARD_OPERATION_ERROR,
            error: e,
        });
    }
}

export function* getBoards(action) {
    yield put({ type: types.BOARD_REQUEST });
    try {
        const boards = getBoardsFromStorage();
        yield put({
            type: types.GET_BOARDS_SUCCESS,
            data: boards,
        });
    } catch (e) {
        yield put({
            type: types.BOARD_OPERATION_ERROR,
            error: e.response,
        });
    }
}

export function* getBoardById(action) {
    yield put({ type: types.BOARD_REQUEST });
    try {
        const boards = getBoardsFromStorage();
        const board = _.find(boards, { id: action.payload });
        if (board === undefined) throw new Error('Board_absend');
        const lists = getListsFromStorageByBoard(action.payload);
        const cards = getCardsFromStorageByBoard(action.payload);
        const sortedCards = _.sortBy(cards, ['index']);
        const activities = getActivityFromStorageByBoard(action.payload);
        yield put({
            type: types.GET_CARDS_BY_BOARD_SUCCESS,
            data: sortedCards,
        });
        yield put({
            type: types.GET_LISTS_BY_BOARD_SUCCESS,
            data: lists,
        });
        yield put({
            type: types.GET_BOARD_BY_ID_SUCCESS,
            data: board,
            activities: activities,
        });
    } catch (e) {
        yield put({
            type: types.BOARD_OPERATION_ERROR,
            error: e.message,
        });
    }
}

export function* renameBoard(action) {
    yield put({ type: types.BOARD_REQUEST });
    try {
        const boards = getBoardsFromStorage();
        const board = _.find(boards, { id: action.payload.id, user: action.payload.author });
        if (board === undefined) throw new Error('Nothing renamed');
        board.name = action.payload.name;
        window.localStorage.setItem('boards', JSON.stringify(boards));
        yield put({
            type: types.BOARD_RENAME_SUCCESS,
            data: {
                newName: action.payload.name,
                boards: boards,
            },
        });
    } catch (e) {
        yield put({
            type: types.BOARD_OPERATION_ERROR,
            error: e.message,
        });
    }
}

export function* deleteBoard(action) {
    yield put({ type: types.BOARD_REQUEST });
    try {
        const boards = getBoardsFromStorage();
        const newBoards = boards.filter(
            (element) => element.id !== action.payload.id || element.user !== action.payload.author
        );
        if (newBoards.length === boards.length) throw new Error('Yoy cant delete this board');
        window.localStorage.setItem('boards', JSON.stringify(newBoards));
        deleteListByBoard(action.payload.id);
        action.payload.history.replace('/');
        yield put({
            type: types.BOARD_DELETE_SUCCESS,
            data: boards,
        });
    } catch (e) {
        yield put({
            type: types.BOARD_OPERATION_ERROR,
            error: e.message,
        });
    }
}
