import * as types from '../actionTypes';
import * as activityTypes from '../../utils/activityTypes';
import { put } from 'redux-saga/effects';
import { v4 as uuidv4 } from 'uuid';
import { select } from 'redux-saga/effects';
import { saveListToStorage, getListsFromStorage, writeActivity, deleteCardsByList } from '../../utils/storageFunctions';

export function* createList(action) {
    yield put({ type: types.LIST_REQUEST });
    try {
        const { list } = yield select();
        list.lists.forEach((list) => {
            if (list.name === action.payload.name) throw new Error('Wrong name');
        });
        const newList = {
            name: action.payload.name,
            user: action.payload.user,
            id: uuidv4(),
            boardId: action.payload.board,
        };
        saveListToStorage(newList);
        const activity = writeActivity(
            {
                type: activityTypes.CREATE_LIST,
                list: action.payload.name,
            },
            action.payload.user,
            action.payload.board,
            action.payload.authorInfo
        );
        yield put({
            type: types.LIST_CREATE_SUCCESS,
            data: newList, 
            activity: activity,
        });
    } catch (e) {
        yield put({
            type: types.LIST_OPERATION_ERROR,
            error: e,
        });
    }
}

export function* deleteList(action) {
    yield put({ type: types.LIST_REQUEST });
    try {
        const lists = getListsFromStorage();
        const newLists = lists.filter(
            (element) => element.id !== action.payload.listId || element.user !== action.payload.user
        );
        if (lists.length === newLists.length) throw new Error('You don t have rights');
        window.localStorage.setItem('lists', JSON.stringify(newLists));
        deleteCardsByList([action.payload.listId]);
        const activity = writeActivity(
            {
                type: activityTypes.DELETE_LIST,
                list: action.payload.list,
            },
            action.payload.user,
            action.payload.board,
            action.payload.authorInfo
        );
        const { list, card } = yield select();
        const stateList = list.lists.filter(
            (element) => element.id !== action.payload.listId );
        const stateCard = card.cards.filter(
            (element) => element.listId !== action.payload.listId);
        yield put({
            type: types.LIST_DELETE_SUCCESS,
            data: stateList,
            activity: activity, 
            cards:stateCard,
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: types.LIST_OPERATION_ERROR,
            error: e.response,
        });
    }
}

export function* renameList(action) {
    yield put({ type: types.LIST_REQUEST });
    try {
        const lists = getListsFromStorage();
        lists.forEach((element) => {
            if (element.id === action.payload.listId && element.user === action.payload.user) {
                element.name = action.payload.name;
            }
        });
        window.localStorage.setItem('lists', JSON.stringify(lists));
        const activity = writeActivity(
            {
                type: activityTypes.RENAME_LIST,
                list: action.payload.list,
                newName: action.payload.name,
            },
            action.payload.user,
            action.payload.board,
            action.payload.authorInfo
        );
        const { list } = yield select();
        list.lists.forEach((element) => {
            if (element.id === action.payload.listId && element.user === action.payload.user) {
                element.name = action.payload.name;
            }
        });
        yield put({
            type: types.LIST_RENAME_SUCCESS,
            data: list.lists,
            activity: activity
        });
    } catch (e) {
        yield put({
            type: types.LIST_OPERATION_ERROR,
            error: e.response,
        });
    }
}
