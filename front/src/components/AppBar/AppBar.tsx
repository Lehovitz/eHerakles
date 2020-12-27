import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar } from "material-ui";
import { Hidden, IconButton, SwipeableDrawer } from "@material-ui/core";
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

type ActionsProps = {
  type: "drawer" | "navbar";
  closeDrawer: () => void;
};

const Actions = ({ type, closeDrawer }: ActionsProps) => {
  const bearerToken = useSelector((state: RootState) => state.token),
    decodedToken: DecodedToken | undefined =
      bearerToken.token.length > 0 ? jwtDecode(bearerToken.token) : undefined,
    role = decodedToken?.role ?? "none",
    [redirect, setRedirect] = useState(false),
    dispatch = useDispatch(),
    linkClass = type === "drawer" ? styles.drawerAction : styles.navBarAction,
    buttonClass = type === "drawer" ? styles.drawerButton : "",
    logoutClass = type === "drawer" ? styles.drawerLogout : "";

  const handleLogout = () => {
    dispatch(updateToken(""));
    setRedirect(true);
  };

  return (
    <>
      {redirect && <Redirect to="/" />}
      {role !== "none" ? (
        <>
          <Link className={linkClass} to="scheduler" onClick={closeDrawer}>
            <Button className={buttonClass} color="inherit">
              Scheduler
            </Button>
          </Link>
          <Link className={linkClass} to="bmi" onClick={closeDrawer}>
            <Button className={buttonClass} color="inherit">
              BMI
            </Button>
          </Link>
          <Link className={linkClass} to="bmr" onClick={closeDrawer}>
            <Button className={buttonClass} color="inherit">
              BMR
            </Button>
          </Link>
          <Link className={linkClass} to="payments" onClick={closeDrawer}>
            <Button className={buttonClass} color="inherit">
              Payments
            </Button>
          </Link>
          <Link
            className={linkClass}
            to="pendingPayments"
            onClick={closeDrawer}
          >
            <Button className={buttonClass} color="inherit">
              Pending payments
            </Button>
          </Link>
          <Button
            className={logoutClass}
            onClick={handleLogout}
            color="inherit"
          >
            Logout
          </Button>
        </>
      ) : (
        <Button color="inherit">Login</Button>
      )}
    </>
  );
};

const AppBarComponent = () => {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar style={{ backgroundColor: "#2196f3" }}>
          <Hidden smUp>
            <IconButton
              className={styles.menuButton}
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerOpen}
            >
              <Menu />
            </IconButton>

            <SwipeableDrawer
              open={open}
              onOpen={handleDrawerOpen}
              onClose={handleDrawerClose}
              classes={{
                paper: styles.drawer,
              }}
            >
              <div className={styles.drawerContainer}>
                <Actions type="drawer" closeDrawer={handleDrawerClose} />
              </div>
            </SwipeableDrawer>
          </Hidden>

          <Hidden xsDown>
            <div className={styles.actionsContainer}>
              <Actions type="navbar" closeDrawer={handleDrawerClose} />
            </div>
          </Hidden>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default AppBarComponent;
