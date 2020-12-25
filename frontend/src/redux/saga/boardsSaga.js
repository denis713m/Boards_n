import * as types from '../actionTypes';
import { put } from 'redux-saga/effects';
import _ from 'lodash';
import { select } from 'redux-saga/effects';
import { stopSubmit } from 'redux-form';
import ERROR_MESSAGES from '../../ERROR_CONSTANTS';
import { createBoard, deleteBoards, getAllBoards, renameBoards, getBoardByIds } from '../../api/fetchApi';

export function* createBoards(action) {
    yield put({ type: types.BOARD_REQUEST });
    try {
        const { boards } = yield select();
        const boardWithNewName = _.find(boards.boards, { name: action.payload.name });
        if (!_.isUndefined(boardWithNewName)) throw new Error('Name exists');
        const { data } = yield createBoard({ name: action.payload.name });
        yield put({
            type: types.BOARD_CREATE_SUCCESS,
            data: {
                name: action.payload.name,
                user: action.payload.user,
                id: data,
            },
        });
        action.payload.history.push(`/board/${data}`);
    } catch (e) {
        if (e.message === 'Name exists' || e.response.data === 'Name exists')
            yield put(stopSubmit('createBoard', { name: ERROR_MESSAGES.BOARD_EXIST }));
        else yield put(stopSubmit('createBoard', { name: ERROR_MESSAGES.default }));
        yield put({
            type: types.BOARD_OPERATION_ERROR,
        });
    }
}

export function* getBoards(action) {
    yield put({ type: types.BOARD_REQUEST });
    try {
        const { data } = yield getAllBoards();
        yield put({
            type: types.GET_BOARDS_SUCCESS,
            data: data,
        });
    } catch (e) {
        yield put({
            type: types.BOARD_OPERATION_ERROR,
        });
    }
}

export function* getBoardById(action) {
    yield put({ type: types.BOARD_REQUEST });
    try {
        const { data } = yield getBoardByIds({ id: action.payload });
        yield put({
            type: types.GET_CARDS_BY_BOARD_SUCCESS,
            data: data.Cards,
        });
        console.log(data);
        yield put({
            type: types.GET_LISTS_BY_BOARD_SUCCESS,
            data: data.Lists,
        });
        yield put({
            type: types.GET_BOARD_BY_ID_SUCCESS,
            data: { id: data.id, name: data.name, user: data.user },
            activities: data.Activities,
        });
    } catch (e) {
        yield put({
            type: types.BOARD_OPERATION_ERROR,
            error: e.response.data === 'Board_absend' ? ERROR_MESSAGES.BOARD_ABSEND : ERROR_MESSAGES.default,
        });
    }
}

export function* renameBoard(action) {
    yield put({ type: types.BOARD_REQUEST });
    try {
        const { boards } = yield select();
        const boardWithNewName = _.find(boards.boards, { name: action.payload.name });
        if (!_.isUndefined(boardWithNewName)) throw new Error('Name exists');
        const board = _.find([...boards.boards, boards.currentBoard], {
            id: action.payload.id,
            user: action.payload.author,
        });
        if (_.isUndefined(board)) throw new Error('NO_RIGHTS');
        yield renameBoards({ id: action.payload.id, newName: action.payload.name });
        board.name = action.payload.name;
        yield put({
            type: types.BOARD_RENAME_SUCCESS,
            data: {
                newName: action.payload.name,
                boards: boards.boards,
            },
        });
        action.payload.showRenameForm(false);
    } catch (e) {
        if (e.message === 'Name exists' || e.response.data === 'Name exists')
            yield put(stopSubmit('renameBoard', { name: ERROR_MESSAGES.BOARD_EXIST }));
        else if (e.message === 'NO_RIGHTS') yield put(stopSubmit('renameBoard', { name: ERROR_MESSAGES.NO_RIGHTS }));
        else yield put(stopSubmit('renameBoard', { name: ERROR_MESSAGES.default }));
        yield put({
            type: types.BOARD_OPERATION_ERROR,
        });
    }
}

export function* deleteBoard(action) {
    yield put({ type: types.BOARD_REQUEST });
    try {
        const { boards } = yield select();
        const board = _.find([...boards.boards, boards.currentBoard], {
            id: action.payload.id,
            user: action.payload.author,
        });
        if (_.isUndefined(board)) throw new Error('NO_RIGHTS');
        yield deleteBoards({ id: action.payload.id });
        action.payload.history.replace('/');
        yield put({
            type: types.BOARD_DELETE_SUCCESS,
        });
    } catch (e) {
        yield put({
            type: types.BOARD_OPERATION_ERROR,
            error: ERROR_MESSAGES.default,
        });
    }
}
