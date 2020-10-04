import { UPDATE_TOKEN, TokenActionTypes, UPDATE_LOGIN_ERROR } from "./types";

export function updateToken(token: string): TokenActionTypes {
  return {
    type: UPDATE_TOKEN,
    payload: token,
  };
}

export function updateLoginError(error: string): TokenActionTypes {
  return {
    type: UPDATE_LOGIN_ERROR,
    payload: error,
  };
}
