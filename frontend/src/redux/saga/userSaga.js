import * as types from '../actionTypes';
import { put } from 'redux-saga/effects';
import { registerRequest, loginRequest, getUserRequest } from '../../api/fetchApi';
import { stopSubmit } from 'redux-form';
import ERROR_MESSAGES from '../../ERROR_CONSTANTS';

export function* registrationUser(action) {
    yield put({ type: types.REGISTRATION_USER_REQUEST });
    try {
        const { data } = yield registerRequest(action.payload.values);
        action.payload.history.replace('/');
        yield put({
            type: types.REGISTRATION_USER_SUCCESS,
            data: {
                firstName: action.payload.values.firstName,
                userId: data.id,
                lastName: action.payload.values.lastName,
                displayName: action.payload.values.displayName,
                email: action.payload.values.email,
            },
        });
    } catch (e) {
        if (e.message === 'EMAIL_BUSY' || (e.response && e.response.data === 'EMAIL_BUSY'))
            yield put(stopSubmit('register', { email: ERROR_MESSAGES.EMAIL_BUSY }));
        else yield put(stopSubmit('register', { firstName: ERROR_MESSAGES.default }));
        yield put({ type: types.REGISTRATION_USER_ERROR });
    }
}

export function* login(action) {
    yield put({ type: types.REGISTRATION_USER_REQUEST });
    try {
        const { data } = yield loginRequest(action.payload.values);
        action.payload.history.replace('/');
        yield put({ type: types.REGISTRATION_USER_SUCCESS, data: data });
    } catch (e) {
        if (e.message === 'WRONG_PASS' || (e.response && e.response.data === 'WRONG_PASS'))
            yield put(stopSubmit('login', { password: ERROR_MESSAGES.WRONG_PASS }));
        else if (e.message === 'NOT_EXIST' || (e.response && e.response.data === 'NOT_EXIST'))
            yield put(stopSubmit('login', { email: ERROR_MESSAGES.NOT_EXIST }));
        else yield put(stopSubmit('login', { email: ERROR_MESSAGES.default }));
        yield put({ type: types.REGISTRATION_USER_ERROR });
    }
}

export function* getUser(action) {
    yield put({ type: types.REGISTRATION_USER_REQUEST });
    try {
        const { data } = yield getUserRequest();
        yield put({ type: types.REGISTRATION_USER_SUCCESS, data: data });
    } catch (e) {
        yield put({ type: types.REGISTRATION_USER_ERROR, error: e.response });
    }
}
