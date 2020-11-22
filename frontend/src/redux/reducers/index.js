import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form'
import userReducer from './userReducer';
import boardsReducer from './boardsReducer';


const rootReducer=combineReducers({
    form: formReducer,
    user: userReducer, 
    boards: boardsReducer
 });

 export default rootReducer;