import * as types from '../actionTypes';
import * as activityTypes from '../../utils/activityTypes';
import { put } from 'redux-saga/effects';
import _ from 'lodash';
import moment from 'moment';
import { select } from 'redux-saga/effects';
import { stopSubmit, reset } from 'redux-form';
import ERROR_MESSAGES from '../../ERROR_CONSTANTS';
import * as request from '../../api/fetchApi';

export function* createList(action) {
    yield put({ type: types.LIST_REQUEST });
    let date;
    try {
        const { name, boardId, userId, authorInfo, boardAuthor } = action.payload;
        const { list, boards } = yield select();
        date = new Date();
        const sameNameList = _.find(list.lists, { name: action.payload.name });
        if (!_.isUndefined(sameNameList)) throw new Error('Name exists');
        const { data } = yield request.createList({ name, boardId, boardAuthor });
        yield put({
            type: types.LIST_CREATE_SUCCESS,
            data: {
                name,
                userId,
                id: data.id,
                boardId,
            },
            activity: {
                id: `${boards.activities.length}activity`,
                type: activityTypes.CREATE_LIST,
                List: { name },
                boardId,
                User: authorInfo,
                time: moment(),
            },
        });
        yield put(reset('createList'));
    } catch (e) {
        if (e.message === 'Name exists' || (e.response && e.response.data === 'Name exists'))
            yield put(stopSubmit('createList', { name: ERROR_MESSAGES.LIST_EXIST }));
        else yield put(stopSubmit('createList', { name: ERROR_MESSAGES.default }));
        yield put({
            type: types.LIST_OPERATION_ERROR,
        });
    }
}

export function* deleteList(action) {
    yield put({ type: types.LIST_REQUEST });
    try {
        const { userId, listId, boardAuthor, boardId, authorInfo } = action.payload;
        const { list, card, boards } = yield select();
        const listToDelete = _.find(list.lists, userId === boardAuthor ? { id: listId } : { id: listId, userId });
        if (_.isUndefined(listToDelete)) throw new Error('NO_RIGHTS');
        const stateList = list.lists.filter((element) => element.id !== listId);
        yield request.deleteList({
            id: listId,
            boardAuthor,
            boardId,
            name: action.payload.list,
        });
        const stateCard = card.cards.filter((element) => element.listId !== listId);
        yield put({
            type: types.LIST_DELETE_SUCCESS,
            data: stateList,
            cards: stateCard,
            activity: {
                id: `${boards.activities.length}activity`,
                type: activityTypes.DELETE_LIST,
                name: action.payload.list,
                boardId,
                User: authorInfo,
                time: moment(),
            },
        });
    } catch (e) {
        yield put({
            type: types.LIST_OPERATION_ERROR,
            error: ERROR_MESSAGES.default,
        });
    }
}

export function* renameList(action) {
    yield put({ type: types.LIST_REQUEST });
    try {
        const { name, boardId, listId, userId, boardAuthor, authorInfo } = action.payload;
        const { list, boards } = yield select();
        const listWithNewName = _.find(list.lists, { name, boardId });
        if (!_.isUndefined(listWithNewName)) throw new Error('Name exists');
        const listToRename = _.find(list.lists, userId === boardAuthor ? { id: listId } : { id: listId, userId });
        if (_.isUndefined(listToRename)) throw new Error('NO_RIGHTS');
        yield request.renameList({
            id: listId,
            newName: name,
            boardAuthor: boardAuthor,
            oldName: action.payload.list,
        });
        listToRename.name = action.payload.name;
        yield put({
            type: types.LIST_RENAME_SUCCESS,
            data: list.lists,
            activity: {
                id: `${boards.activities.length}activity`,
                type: activityTypes.RENAME_LIST,
                List: { name },
                name: action.payload.list,
                boardId,
                User: authorInfo,
                time: moment(),
            },
        });
        action.payload.showRenameForm(false);
    } catch (e) {
        if (e.message === 'Name exists' || (e.response && e.response.data === 'Name exists'))
            yield put(stopSubmit('renameList', { name: ERROR_MESSAGES.LIST_EXIST }));
        else if (e.message === 'NO_RIGHTS') yield put(stopSubmit('renameList', { name: ERROR_MESSAGES.NO_RIGHTS }));
        else yield put(stopSubmit('renameList', { name: ERROR_MESSAGES.default }));
        yield put({
            type: types.LIST_OPERATION_ERROR,
        });
    }
}
