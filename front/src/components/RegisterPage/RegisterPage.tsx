import { Button, Grid, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useState } from "react";
import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import styles from "./RegisterPage.module.scss";

const RegisterPage = () => {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [confirmPass, setConfirmPass] = useState(""),
    [passIdentical, setPassIdentical] = useState(false),
    [redirect, setRedirect] = useState(false),
    [emailExists, setEmailExists] = useState(false),
    [error, setError] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  useEffect(() => {
    setPassIdentical(password === confirmPass);
  }, [confirmPass, password]);

  const validateMail = () => {
    var re = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
    return re.test(email);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handlePasswordConformationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPass(event.target.value);
  };

  // const checkIfEmailExists = async () => {
  //   const response = await fetch(
  //     `http://localhost:5000/customers/getCustomerGoalByEmail/${email}`
  //   );
  //   if (response.status === 400) {
  //     setEmailExists(true);
  //   }
  // };
  const handleRegisterClick = async () => {
    const response = await fetch("http://localhost:5000/customers/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseText = await response.text();
    if (response.ok) {
      setRedirect(true);
    } else {
      setError(responseText);
    }
  };

  return (
    <div className={styles.mainContainer}>
      {redirect && <Redirect to="/"></Redirect>}

      <Grid container spacing={2} className={styles.container}>
        <Grid item xs={12} className={styles.alertBox}>
          {error != "" && <Alert severity="error">{error}</Alert>}
        </Grid>
        <Grid item xs={12}>
          <h1 className={styles.headers}>eHerakles</h1>
        </Grid>
        <Grid item xs={12}>
          <TextField
            className={styles.textField}
            type="email"
            id="emailRegister"
            required
            label="e-mail"
            variant="filled"
            onChange={handleEmailChange}
            error={error !== ""}
          ></TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            className={styles.textField}
            required
            id="PassRegister"
            type="password"
            label="Password"
            variant="filled"
            onChange={handlePasswordChange}
          ></TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            className={styles.textField}
            required
            id="PassConf"
            type="password"
            label="Confirm password"
            variant="filled"
            onChange={handlePasswordConformationChange}
            error={password !== "" && confirmPass !== "" && !passIdentical}
            helperText={
              password !== "" && confirmPass !== "" && !passIdentical
                ? "Passwords don't match."
                : ""
            }
          ></TextField>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            id="RegisterButtons"
            className={styles.button}
            onClick={handleRegisterClick}
            disabled={
              email === "" ||
              password === "" ||
              confirmPass === "" ||
              !passIdentical
            }
          >
            Register
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default RegisterPage;
