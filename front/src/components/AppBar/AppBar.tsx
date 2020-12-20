import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar } from "material-ui";
import { IconButton } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Menu } from "@material-ui/icons";
import { Redirect, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateToken } from "../../redux/bearerToken/actions";
import DecodedToken from "../../models/DecodedToken";
import { RootState } from "../../redux";
import jwt_decode from "jwt-decode";

const AppBarComponent = () => {
  const history = useHistory(),
    dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(updateToken(""));
    history.push("/");
  };
  const handleSchedulerClick = () => {
    setRedirectScheduler(true);
  };
  const handleBMIClick = () => {
    setRedirectBMI(true);
  };
  const handleBMRClick = () => {
    setRedirectBMR(true);
  };
  const [redirectBMI, setRedirectBMI] = useState(false);
  const [redirectBMR, setRedirectBMR] = useState(false);
  const [redirectScheduler, setRedirectScheduler] = useState(false);

  return (
    <AppBar position="static" color="default">
      <Toolbar style={{ background: "blue" }}>
        {redirectBMI && <Redirect to="/customer/bmi"></Redirect>}
        {redirectBMR && <Redirect to="/customer/bmr"></Redirect>}

        {redirectScheduler && <Redirect to="/"></Redirect>}

        <IconButton edge="start" color="inherit" aria-label="menu">
          <Menu />
        </IconButton>
        <Button onClick={handleLogout} color="inherit">
          Logout
        </Button>
        <Button onClick={handleSchedulerClick} color="inherit">
          Scheduler
        </Button>
        <Button onClick={handleBMIClick} color="inherit">
          BMI
        </Button>
        <Button onClick={handleBMRClick} color="inherit">
          BMR
        </Button>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
