import * as types from '../actionTypes';
import { put } from 'redux-saga/effects';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import CONSTANTS from '../../serverEmulator/CONSTANTS';
import { getUsersFromStorage } from '../../utils/storageFunctions';
import { hashPass, passwordCompare } from '../../serverEmulator/password';
import { generateTokens } from '../../serverEmulator/generateTokens';

export function* registrationUser(action) {
    yield put({ type: types.REGISTRATION_USER_REQUEST });
    try {
        const users = getUsersFromStorage();
        const user = _.find(users, { email: action.payload.values.email });
        if (user !== undefined) throw new Error('User with this email exists');
        const password = hashPass(action.payload.values.password);
        const newUser = {
            firstName: action.payload.values.firstName,
            userId: uuidv4(),
            lastName: action.payload.values.lastName,
            displayName: action.payload.values.displayName,
            email: action.payload.values.email,
        };
        const token = generateTokens(newUser);
        window.localStorage.setItem('accessToken', token);
        users.push({ ...newUser, password: password, token: token });
        window.localStorage.setItem('users', JSON.stringify(users));
        action.payload.history.replace('/');
        yield put({ type: types.REGISTRATION_USER_SUCCESS, data: newUser });
    } catch (e) {
        yield put({ type: types.REGISTRATION_USER_ERROR, error: e.message });
    }
}

export function* login(action) {
    yield put({ type: types.REGISTRATION_USER_REQUEST });
    try {
        const users = getUsersFromStorage();
        const user = _.find(users, { email: action.payload.values.email });
        if (user === undefined) throw new Error('User with this email doesnt exists');
        passwordCompare(action.payload.values.password, user.password);
        const token = generateTokens(user);
        user.token = token;
        window.localStorage.setItem('users', JSON.stringify(users));
        window.localStorage.setItem('accessToken', token);
        action.payload.history.replace('/');
        yield put({ type: types.REGISTRATION_USER_SUCCESS, data: user });
    } catch (e) {
        yield put({ type: types.REGISTRATION_USER_ERROR, error: e.message });
    }
}

export function* getUser(action) {
    yield put({ type: types.REGISTRATION_USER_REQUEST });
    try {
        const token = window.localStorage.getItem('accessToken');
        if (token === undefined) {
            throw new Error('need token');
        }
        const tokenData = jwt.verify(token, CONSTANTS.SECRET_FOR_TOKEN);
        const users = getUsersFromStorage();
        const user = _.find(users, { userId: tokenData.userId });
        if (user === undefined) throw new Error('Server error');
        yield put({ type: types.REGISTRATION_USER_SUCCESS, data: user });
    } catch (e) {
        yield put({ type: types.REGISTRATION_USER_ERROR, error: e.message });
    }
}
