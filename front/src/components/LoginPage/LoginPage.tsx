import { Button, Grid, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { render } from "@testing-library/react";
import React, { Component, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { RootState } from "../../redux";
import { updateLoginError } from "../../redux/bearerToken/actions";
import { updateTokenThunk } from "../../redux/bearerToken/thunks";
import styles from "./LoginPage.module.scss";
import jwt_decode from "jwt-decode";
import DecodedToken from "../../models/DecodedToken";

const LoginPage = () => {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [redirect, setRedirect] = useState(false),
    [loggedIn, setLoggedIn] = useState(false),
    [isEmailValid, setIsEmailValid] = useState(true),
    [isError, setIsError] = useState(false),
    bearerToken = useSelector((state: RootState) => state.token),
    dispatch = useDispatch();

  useEffect(() => {
    if (bearerToken.token !== "") {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [bearerToken.token]);

  useEffect(() => {
    if (bearerToken.error !== "") {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
        dispatch(updateLoginError(""));
      }, 3000);
    }
  }, [bearerToken.error]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLoginClick = () => {
    dispatch(updateTokenThunk(email, password));
  };

  const handleRegisterClick = () => {
    setRedirect(true);
  };

  const renderRedirect = () => {
    if (redirect) {
      return <Redirect to="/register"></Redirect>;
    }
  };

  const loggedInRedirect = () => {
    if (loggedIn) {
      const decodedToken: DecodedToken = jwt_decode(bearerToken.token);

      return <Redirect to={`${decodedToken.role}/`}></Redirect>;
    }
  };

  return (
    <div className={styles.mainContainer}>
      {loggedInRedirect()}
      {renderRedirect()}

      <Grid container spacing={2} className={styles.container}>
        <Grid item xs={12} className={styles.alertBox}>
          {isError && <Alert severity="error">{bearerToken.error}</Alert>}
        </Grid>
        <Grid item xs={12}>
          <h1 className={styles.headers}>eHerakles</h1>
        </Grid>
        <Grid item xs={12}>
          <TextField
            className={styles.textField}
            type="email"
            id="emailLog"
            required
            label="e-mail"
            variant="filled"
            onChange={handleEmailChange}
          ></TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            className={styles.textField}
            required
            id="PassLogIn"
            type="password"
            label="Password"
            variant="filled"
            onChange={handlePasswordChange}
          ></TextField>
        </Grid>
        <Grid item xs={12}>
          <div className={styles.buttonGeneralBox}>
            <div className={styles.buttonBox}>
              <Button
                variant="contained"
                id="LogInButton"
                className={styles.button}
                onClick={handleLoginClick}
              >
                Login
              </Button>

              <Button
                variant="contained"
                id="RegisterButtons"
                className={styles.button}
                onClick={handleRegisterClick}
              >
                Register
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default LoginPage;
