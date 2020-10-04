import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "..";
import { updateLoginError, updateToken } from "./actions";

export const updateTokenThunk = (
  email: string,
  password: string
): ThunkAction<Promise<void>, RootState, unknown, Action<String>> => async (
  dispatch
) => {
  const response = await fetch("http://localhost:5000/customers/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const responseText = await response.text();
  if (response.ok) {
    dispatch(updateToken(responseText));
    dispatch(updateLoginError(""));
  } else {
    dispatch(updateLoginError(responseText));
  }
};
