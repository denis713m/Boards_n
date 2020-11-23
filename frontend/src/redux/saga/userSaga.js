import * as types from '../actionTypes';
import { put } from 'redux-saga/effects';
import {registerRequest, loginRequest, getUserRequest} from '../../api/fetchApi';


export function* registrationUser(action) {
    yield put({type: types.REGISTRATION_USER_REQUEST});
    try{
        const {data} = yield  registerRequest(action.data.values);
        action.data.history.replace('/');
        yield put({type: types.REGISTRATION_USER_SUCCESS, data:{
            firstName: action.data.values.firstName,
            userId: data.id,
            lastName: action.data.values.lastName,
            displayName: action.data.values.displayName,
        }});
    }
    catch (e) {
        yield put({type: types.REGISTRATION_USER_ERROR, error: e.response});
    }
 };

 export function* login(action) {
    yield put({type: types.REGISTRATION_USER_REQUEST});
    try{
        const {data} = yield  loginRequest(action.data.values);
        action.data.history.replace('/');
        yield put({type: types.REGISTRATION_USER_SUCCESS, data:data});
    }
    catch (e) {
        yield put({type: types.REGISTRATION_USER_ERROR, error: e.response});
    }
 }

 export function* getUser(action) {
    yield put({type: types.REGISTRATION_USER_REQUEST});
    try{
        const {data} = yield  getUserRequest();
        yield put({type: types.REGISTRATION_USER_SUCCESS, data:data});
    }
    catch (e) {
        yield put({type: types.REGISTRATION_USER_ERROR, error: e.response});
    }
 }