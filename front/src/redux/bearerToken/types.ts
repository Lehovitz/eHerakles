export const UPDATE_TOKEN = "UPDATE_TOKEN";
export const UPDATE_LOGIN_ERROR = "UPDATE_LOGIN_ERROR";
interface UpdateToken {
  type: typeof UPDATE_TOKEN;
  payload: string;
}

interface UpdateLoginError {
  type: typeof UPDATE_LOGIN_ERROR;
  payload: string;
}

export interface TokenState {
  token: string;
  error: string;
}

export type TokenActionTypes = UpdateToken | UpdateLoginError;
