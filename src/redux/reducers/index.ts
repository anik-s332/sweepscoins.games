import { combineReducers } from "redux";
import { posterReducers } from "./posterReducers";

const reducers = combineReducers({
    allReducers: posterReducers,
})

export default reducers;