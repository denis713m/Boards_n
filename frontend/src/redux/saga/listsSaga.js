import * as types from '../actionTypes';
import {
    put
} from 'redux-saga/effects';
import {
    v4 as uuidv4
} from 'uuid';
import {
    select
} from 'redux-saga/effects'
import {
    saveListToStorage,
    getListsFromStorage
} from '../../utils/functions';

export function* createList(action) {
    yield put({
        type: types.LIST_REQUEST
    });
    try {
        const {
            list
        } = yield select();
        list.lists.forEach(list => {
            if (list.name === action.payload.name) throw new Error('Wrong name');
        });
        const newList = {
            name: action.payload.name,
            user: action.payload.user,
            id: uuidv4(),
            boardId: action.payload.board
        }
        saveListToStorage(newList);
        console.log(newList);
        yield put({
            type: types.LIST_CREATE_SUCCESS,
            data: newList
        });
    } catch (e) {
        yield put({
            type: types.LIST_OPERATION_ERROR,
            error: e
        });
    }
};

export function* deleteList(action) {
    yield put({
        type: types.LIST_REQUEST
    });
    try {
        const lists = getListsFromStorage();
        const newLists = lists.filter(element => ((element.id !== action.payload.list) ||
            (element.user !== action.payload.user)));
        window.localStorage.setItem('lists', JSON.stringify(newLists));
        const {
            list
        } = yield select();
        const stateList = list.lists.filter(element => ((element.id !== action.payload.list) ||
            (element.user !== action.payload.user)));
        yield put({
            type: types.LIST_DELETE_SUCCESS,
            data: stateList
        });
    } catch (e) {
        yield put({
            type: types.LIST_OPERATION_ERROR,
            error: e.response
        });
    }
}

export function* renameList(action) {
    yield put({
        type: types.LIST_REQUEST
    });
    try {
        const lists = getListsFromStorage();
        lists.forEach(element => {
            if (element.id === action.payload.id && element.user === action.payload.user) {
                element.name = action.payload.name;
            }
        })
        window.localStorage.setItem('lists', JSON.stringify(lists));
        const {
            list
        } = yield select();
        list.lists.forEach(element => {
            if (element.id === action.payload.id && element.user === action.payload.user) {
                element.name = action.payload.name;
            }
        });
        yield put({
            type: types.LIST_RENAME_SUCCESS,
            data: list.lists
        });
    } catch (e) {
        yield put({
            type: types.LIST_OPERATION_ERROR,
            error: e.response
        });
    }
}