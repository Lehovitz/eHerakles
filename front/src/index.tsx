import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { rootReducer } from "./redux";
import { Provider } from "react-redux";

declare global {
  interface Window {
    _REDUX_DEVTOOLS_EXTENSION_COMPOSE_?: typeof compose;
  }
}

const middlewares = [thunk];
const composedEnhancers = composeWithDevTools(applyMiddleware(...middlewares));

const store = createStore(rootReducer, {}, composedEnhancers);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
