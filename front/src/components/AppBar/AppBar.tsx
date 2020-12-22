import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar } from "material-ui";
import { IconButton } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Menu } from "@material-ui/icons";
import { Link, Redirect, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateToken } from "../../redux/bearerToken/actions";
import DecodedToken from "../../models/DecodedToken";
import { RootState } from "../../redux";
import jwtDecode from "jwt-decode";
import styles from "./AppBar.module.scss";

const AppBarComponent = () => {
  const history = useHistory(),
    dispatch = useDispatch();

  const bearerToken = useSelector((state: RootState) => state.token),
    decodedToken: DecodedToken | undefined =
      bearerToken.token.length > 0 ? jwtDecode(bearerToken.token) : undefined,
    role = decodedToken?.role ?? "none";

  const handleLogout = () => {
    dispatch(updateToken(""));
    history.push("/");
  };
  const handleSchedulerClick = () => {
    setRedirectBMR(false);
    setRedirectBMI(false);
    setRedirectScheduler(true);
  };
  const handleBMIClick = () => {
    setRedirectBMR(false);
    setRedirectBMI(true);
    setRedirectScheduler(false);
  };
  const handleBMRClick = () => {
    setRedirectBMR(true);
    setRedirectBMI(false);
    setRedirectScheduler(false);
  };
  const [redirectBMI, setRedirectBMI] = useState(false);
  const [redirectBMR, setRedirectBMR] = useState(false);
  const [redirectScheduler, setRedirectScheduler] = useState(false);

  return (
    <AppBar position="static" color="primary">
      <Toolbar style={{ backgroundColor: "#2196f3" }}>
        {redirectBMI && <Redirect to="/customer/bmi"></Redirect>}
        {redirectBMR && <Redirect to="/customer/bmr"></Redirect>}

        {redirectScheduler && <Redirect to="/"></Redirect>}

        {/* <IconButton edge="start" color="inherit" aria-label="menu">
          <Menu />
        </IconButton> */}

        <div className={styles.actionsContainer}>
          {role !== "none" ? (
            <>
              <Button onClick={handleSchedulerClick} color="inherit">
                Scheduler
              </Button>
              <Button onClick={handleBMIClick} color="inherit">
                BMI
              </Button>
              <Button onClick={handleBMRClick} color="inherit">
                BMR
              </Button>
              <Link className={styles.action} to="payments">
                <Button style={{ color: "white" }}>Payment</Button>
              </Link>
              <Button onClick={handleLogout} color="inherit">
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit">Login</Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
