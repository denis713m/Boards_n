import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form'
import userReducer from './userReducer';
import boardsReducer from './boardsReducer';
import listsReducer from './listsReducer';


const rootReducer=combineReducers({
    form: formReducer,
    user: userReducer, 
    boards: boardsReducer,
    list: listsReducer
 });

 export default rootReducer;