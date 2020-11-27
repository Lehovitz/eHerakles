import { tokenReducer } from "./bearerToken/reducers";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  token: tokenReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
