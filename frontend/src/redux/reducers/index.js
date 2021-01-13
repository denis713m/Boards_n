import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form'
import userReducer from './userReducer';
import boardsReducer from './boardsReducer';
import listsReducer from './listsReducer';
import cardsReducer from './cardsReducer';


const rootReducer=combineReducers({
    form: formReducer,
    user: userReducer, 
    boards: boardsReducer,
    list: listsReducer,
    card: cardsReducer
 });

 export default rootReducer;