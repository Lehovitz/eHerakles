import React from "react";
import { BrowserRouter, Redirect, Route, RouteProps } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import Card from "./components/Card/Card";
import SchedulerComponent from "./components/Scheduler/Scheduler";
import AppBarComponent from "./components/AppBar/AppBar";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { MuiThemeProvider } from "material-ui/styles";
import { useSelector } from "react-redux";
import { RootState } from "./redux";
import jwtDecode from "jwt-decode";
import DecodedToken from "./models/DecodedToken";
import BMICalculator from "./components/BMICalculator/BMICalculator";
import AdminPage from "./components/AdminPage/AdminPage";
import BMRCalculator from "./components/BMRCalculator/BMRCalculator";
import Payment from "./components/Payment/Payment";
import PendingPayments from "./components/PendingPayments/PendingPayments";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import FormFAB from "./utils/FormFAB";

export default () => (
    <BrowserRouter>
        <MuiThemeProvider>
            <>
                <ThemeProvider theme={theme}>
                    <AppBarComponent></AppBarComponent>
                    <FormFAB></FormFAB>
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
                        path="/cards"
                        role="customer"
                        component={Card}
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
                        path="/profile"
                        role="customer"
                        component={ProfilePage}
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
                        role="admin"
                        component={SchedulerComponent}
                    />
                    <ProtectedRoute
                        exact
                        path="/pendingPayments"
                        role="admin"
                        component={PendingPayments}
                    />
                    <ProtectedRoute
                        exact
                        path="/admin"
                        role="admin"
                        component={AdminPage}
                    />
                    <ProtectedRoute
                        exact
                        path="/admin"
                        role="moderator"
                        component={AdminPage}
                    />
                    <ProtectedRoute
                        exact
                        path="/scheduler"
                        role="moderator"
                        component={SchedulerComponent}
                    />
                    <ProtectedRoute
                        exact
                        path="/pendingPayments"
                        role="moderator"
                        component={PendingPayments}
                    />
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
            bearerToken.token.length > 0
                ? jwtDecode(bearerToken.token)
                : undefined,
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
