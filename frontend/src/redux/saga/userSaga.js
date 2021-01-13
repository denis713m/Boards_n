import * as types from '../actionTypes';
import { put } from 'redux-saga/effects';
import {registerRequest, loginRequest, getUserRequest} from '../../api/fetchApi';


export function* registrationUser(action) {
    yield put({type: types.REGISTRATION_USER_REQUEST});
    try{
        const {data} = yield  registerRequest(action.payload.values);
        action.payload.history.replace('/');
        yield put({type: types.REGISTRATION_USER_SUCCESS, data:{
            firstName: action.payload.values.firstName,
            userId: data.id,
            lastName: action.payload.values.lastName,
            displayName: action.payload.values.displayName,
            email: action.payload.values.email,
        }});
    }
    catch (e) {
        yield put({type: types.REGISTRATION_USER_ERROR, error: e.response});
    }
 };

 export function* login(action) {
    yield put({type: types.REGISTRATION_USER_REQUEST});
    try{
        const {data} = yield  loginRequest(action.payload.values);
        action.payload.history.replace('/');
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