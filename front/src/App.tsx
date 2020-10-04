import React, { Component } from "react";
import styles from "./App.module.scss";
import { HashRouter, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";

export default class App extends Component {
  render() {
    return (
      <HashRouter>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
      </HashRouter>
    );
  }
}
