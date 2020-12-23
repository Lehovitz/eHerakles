import React from "react";
import { BrowserRouter, Redirect, Route, RouteProps } from "react-router-dom";
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
import BMICalculator from "./components/BMICalculator/BMICalculator";
import AdminPage from "./components/AdminPage/AdminPage";
import BMRCalculator from "./components/BMRCalculator/BMRCalculator";
import Payment from "./components/Payment/Payment";

export default () => (
  <BrowserRouter>
    <MuiThemeProvider>
      <>
        <ThemeProvider theme={theme}>
          <AppBarComponent></AppBarComponent>
          <Route exact path="/" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />
          <ProtectedRoute
            exact
            path="/bmr"
            role="customer"
            component={BMRCalculator}
          />
          <ProtectedRoute
            exact
            path="/bmr"
            role="trainer"
            component={BMRCalculator}
          />
          <ProtectedRoute
            exact
            path="/bmi"
            role="customer"
            component={BMICalculator}
          />
          <ProtectedRoute
            exact
            path="/bmi"
            role="trainer"
            component={BMICalculator}
          />
          <ProtectedRoute
            exact
            path="/payments"
            role="customer"
            component={Payment}
          />
          <ProtectedRoute
            exact
            path="/scheduler"
            role="customer"
            component={SchedulerComponent}
          />
          <ProtectedRoute
            exact
            path="/scheduler"
            role="trainer"
            component={SchedulerComponent}
          />
          <ProtectedRoute
            exact
            path="/scheduler"
            role="moderator"
            component={SchedulerComponent}
          />
          <ProtectedRoute path="/" role="admin" component={AdminPage} />
        </ThemeProvider>
      </>
    </MuiThemeProvider>
  </BrowserRouter>
);

interface ProtectedRouteProps extends RouteProps {
  role: "customer" | "trainer" | "moderator" | "admin";
}

const ProtectedRoute = ({
  component,
  role,
  path,
  ...rest
}: ProtectedRouteProps) => {
  const bearerToken = useSelector((state: RootState) => state.token),
    decodedToken: DecodedToken | undefined =
      bearerToken.token.length > 0 ? jwtDecode(bearerToken.token) : undefined,
    pathPrefix =
      decodedToken && decodedToken && decodedToken.role === role
        ? `/${decodedToken.role}`
        : "";

  return (
    <Route
      {...rest}
      path={`${pathPrefix}${path}`}
      render={(props) =>
        decodedToken && decodedToken.role === role ? (
          React.createElement(React.memo(component!), props)
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#2196f3",
      main: "#2196f3",
      dark: "#2196f3",
      contrastText: "#fff",
    },
    type: "light",
  },
});
