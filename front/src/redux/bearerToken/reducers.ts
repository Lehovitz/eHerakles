import {
  TokenState,
  TokenActionTypes,
  UPDATE_TOKEN,
  UPDATE_LOGIN_ERROR,
} from "./types";

const initialState: TokenState = {
  token: "",
  error: "",
};

export function tokenReducer(
  state = initialState,
  action: TokenActionTypes
): TokenState {
  switch (action.type) {
    case UPDATE_TOKEN:
      return { ...state, token: action.payload };
    case UPDATE_LOGIN_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
