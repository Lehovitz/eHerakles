import React, { Component } from "react";
import styles from "./App.module.scss";
import { HashRouter, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import SchedulerComponent from "./components/Scheduler/Scheduler";
import AppBarComponent from "./components/AppBar/AppBar";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { MuiThemeProvider } from "material-ui/styles";

export default class App extends Component {
  render() {
    return (
      <HashRouter>
        <MuiThemeProvider>
          <ThemeProvider theme={darkTheme}>
            <AppBarComponent></AppBarComponent>
          </ThemeProvider>
        </MuiThemeProvider>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/scheduler" component={SchedulerComponent} />
      </HashRouter>
    );
  }
}

const darkTheme = createMuiTheme({
  palette: {
    primary: blue,
    background: {
      paper: "#212121",
      default: "#212121",
    },
    type: "dark",
  },
});
