import * as types from '../actionTypes';
import * as activityTypes from '../../utils/activityTypes';
import { put } from 'redux-saga/effects';
import _ from 'lodash';
import { select } from 'redux-saga/effects';
import { stopSubmit, reset } from 'redux-form';
import ERROR_MESSAGES from '../../ERROR_CONSTANTS';
import server from '../../serverEmulator/server';

export function* createList(action) {
    yield put({ type: types.LIST_REQUEST });
    try {
        const { list } = yield select();
        const sameNameList = _.find(list.lists, { name: action.payload.name });
        if (!_.isUndefined(sameNameList)) throw new Error('LIST_EXIST');
        const { listId, activityId, activityTime } = yield server.createList(action.payload);
        yield put({
            type: types.LIST_CREATE_SUCCESS,
            data: {
                name: action.payload.name,
                user: action.payload.user,
                id: listId,
                boardId: action.payload.board,
            },
            activity: {
                activity: {
                    type: activityTypes.CREATE_LIST,
                    list: action.payload.name,
                },
                id: activityId,
                userId: action.payload.user,
                boardId: action.payload.board,
                authorInfo: action.payload.authorInfo, //temporary information about author(email, name) after using server this information will be gotten from user.table
                time: activityTime,
            },
        });
        yield put(reset('createList'));
    } catch (e) {
        if (e.message === 'LIST_EXIST') yield put(stopSubmit('createList', { name: ERROR_MESSAGES.LIST_EXIST }));
        else yield put(stopSubmit('createList', { name: ERROR_MESSAGES.default }));
        yield put({
            type: types.LIST_OPERATION_ERROR,
        });
    }
}

export function* deleteList(action) {
    yield put({ type: types.LIST_REQUEST });
    try {
        const { id, time } = yield server.deleteList(action.payload);
        const { list, card } = yield select();
        const listToDelete = _.find(list.lists, { id: action.payload.listId });
        if (
            _.isUndefined(listToDelete) &&
            (listToDelete.user === action.payload.user || action.payload.user === action.payload.boardAuthor)
        )
            throw new Error('NO_RIGHTS');
        const stateList = list.lists.filter((element) => element.id !== action.payload.listId);
        const stateCard = card.cards.filter((element) => element.listId !== action.payload.listId);
        yield put({
            type: types.LIST_DELETE_SUCCESS,
            data: stateList,
            cards: stateCard,
            activity: {
                activity: {
                    type: activityTypes.DELETE_LIST,
                    list: action.payload.list,
                },
                id: id,
                userId: action.payload.user,
                boardId: action.payload.board,
                authorInfo: action.payload.authorInfo, //temporary information about author(email, name) after using server this information will be gotten from user.table
                time: time,
            },
        });
    } catch (e) {
        yield put({
            type: types.LIST_OPERATION_ERROR,
            error: e.message,
        });
    }
}

export function* renameList(action) {
    yield put({ type: types.LIST_REQUEST });
    try {
        const { list } = yield select();
        const listWithNewName = _.find(list.lists, { name: action.payload.name, boardId: action.payload.board });
        if (!_.isUndefined(listWithNewName)) throw new Error('Name exists');
        const listToRename = _.find(list.lists, { id: action.payload.listId, user: action.payload.user });
        if (_.isUndefined(listToRename)) throw new Error('NO_RIGHTS');
        const { id, time } = yield server.renameList(action.payload);
        listToRename.name = action.payload.name;
        yield put({
            type: types.LIST_RENAME_SUCCESS,
            data: list.lists,
            activity: {
                activity: {
                    type: activityTypes.RENAME_LIST,
                    list: action.payload.list,
                    newName: action.payload.name,
                },
                id: id,
                userId: action.payload.user,
                boardId: action.payload.board,
                authorInfo: action.payload.authorInfo, //temporary information about author(email, name) after using server this information will be gotten from user.table
                time: time,
            },
        });
        action.payload.showRenameForm(false);
    } catch (e) {
        if (e.message === 'Name exists') yield put(stopSubmit('renameList', { name: ERROR_MESSAGES.LIST_EXIST }));
        else if (e.message === 'NO_RIGHTS') yield put(stopSubmit('renameList', { name: ERROR_MESSAGES.NO_RIGHTS }));
        else yield put(stopSubmit('renameList', { name: ERROR_MESSAGES.default }));
        yield put({
            type: types.LIST_OPERATION_ERROR,
        });
    }
}
