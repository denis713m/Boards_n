import * as types from '../actionTypes';
import { put } from 'redux-saga/effects';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { stopSubmit } from 'redux-form';
import CONSTANTS from '../../serverEmulator/CONSTANTS';
import ERROR_MESSAGES from '../../ERROR_CONSTANTS';
import server from '../../serverEmulator/server';
import { getUsersFromStorage } from '../../utils/storageFunctions';

export function* registrationUser(action) {
    yield put({ type: types.REGISTRATION_USER_REQUEST });
    try {
        const { token, userId } = yield server.registrationUser(action.payload.values);
        window.localStorage.setItem('accessToken', token);
        yield put({
            type: types.REGISTRATION_USER_SUCCESS,
            data: {
                firstName: action.payload.values.firstName,
                userId: userId,
                lastName: action.payload.values.lastName,
                displayName: action.payload.values.displayName,
                email: action.payload.values.email,
            },
        });
        action.payload.history.replace('/');
    } catch (e) {
        if (e.message === 'EMAIL_BUSY') yield put(stopSubmit('register', { email: ERROR_MESSAGES.EMAIL_BUSY }));
        else yield put(stopSubmit('register', { firstName: e.message }));
        yield put({ type: types.REGISTRATION_USER_ERROR });
    }
}

export function* login(action) {
    yield put({ type: types.REGISTRATION_USER_REQUEST });
    try {
        const user = server.login(action.payload.values);
        window.localStorage.setItem('accessToken', user.token);
        yield put({ type: types.REGISTRATION_USER_SUCCESS, data: user });
        action.payload.history.replace('/');        
    } catch (e) {
        if (e.message === 'WRONG_PASS') yield put(stopSubmit('login', { password: ERROR_MESSAGES.WRONG_PASS }));
        else if (e.message === 'NOT_EXIST') yield put(stopSubmit('login', { email: ERROR_MESSAGES.NOT_EXIST }));
        else yield put(stopSubmit('login', { email: ERROR_MESSAGES.default }));
        yield put({ type: types.REGISTRATION_USER_ERROR });
    }
}

export function* getUser() {
    yield put({ type: types.REGISTRATION_USER_REQUEST });
    try {
        const token = window.localStorage.getItem('accessToken');        
        const user = yield server.getUser(token)
        yield put({ type: types.REGISTRATION_USER_SUCCESS, data: user });
    } catch (e) {
        yield put({ type: types.REGISTRATION_USER_ERROR, error: e.message });
    }
}
