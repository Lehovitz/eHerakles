import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { rootReducer, RootState } from "./redux";
import { Provider } from "react-redux";
import _ from "lodash";

declare global {
  interface Window {
    _REDUX_DEVTOOLS_EXTENSION_COMPOSE_?: typeof compose;
  }
}

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch {}
};

const persistedStore = loadState();
const middlewares = [thunk];
const composedEnhancers = composeWithDevTools(applyMiddleware(...middlewares));

const store = createStore(rootReducer, persistedStore, composedEnhancers);

store.subscribe(
  _.throttle(() => {
    saveState({
      token: store.getState().token,
    });
  }, 1000)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
