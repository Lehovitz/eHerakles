import React, { Component } from "react";
import { BrowserRouter, Route, RouteProps } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import SchedulerComponent from "./components/Scheduler/Scheduler";
import AppBarComponent from "./components/AppBar/AppBar";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { MuiThemeProvider } from "material-ui/styles";
import { useSelector } from "react-redux";
import { RootState } from "./redux";
import jwtDecode from "jwt-decode";
import DecodedToken from "./models/DecodedToken";

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider>
          <ThemeProvider theme={darkTheme}>
            <AppBarComponent></AppBarComponent>
          </ThemeProvider>
        </MuiThemeProvider>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        {/* Tak będzie wyglądać chroniony Route do którego ma dostęp tylko trener. */}
        {/* Ścieżka stworzy się z wartości path i roli, więc dla ustawionych niżej */}
        {/* path="/scheduler" i role="trainer" ścieżka będzie /trainer/scheduler */}
        {/* przez co możesz tak samo nazywać routy dla obu typów userów :) */}
        {/* Póki co ustawiam go jako niechroniony Route bo nie ma logowania dla trenera */}
        {/* <ProtectedRoute exact path="/scheduler" role="trainer" component={SchedulerComponent} /> */}
        <Route exact path="/scheduler" component={SchedulerComponent} />
      </BrowserRouter>
    );
  }
}

interface ProtectedRouteProps extends RouteProps  {
  role: "customer" | "trainer";
}

const ProtectedRoute = ({component, role, path, ...rest}: ProtectedRouteProps) => {
  const bearerToken = useSelector((state: RootState) => state.token),
    decodedToken: DecodedToken | undefined = bearerToken.token.length > 0 ? jwtDecode(bearerToken.token) : undefined;

    if (decodedToken && decodedToken.role === role) 
      return <Route {...rest} component={component} path={`/${decodedToken.role}${path}`} />
    else 
      return <h3>Forbidden or unauthorized</h3>
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
