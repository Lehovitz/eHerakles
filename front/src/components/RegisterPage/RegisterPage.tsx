import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { render } from "@testing-library/react";
import React, { Component, useEffect, useState } from "react";
import styles from "./RegisterPage.module.scss";

const RegisterPage = () => {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [redirect, setRedirect] = useState(false),
    [isEmailValid, setIsEmailValid] = useState(true),
    [isPasswordValid, setIsPasswordValid] = useState(true),
    [error, setError] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleRegisterClick = async () => {
    const response = await fetch("http://localhost:5000/customers/register/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseText = await response.text();
    if (response.ok) {
    } else {
      setError(responseText);
      console.log(responseText);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <Grid container spacing={2} className={styles.container}>
        <Grid item xs={12} className={styles.alertBox}></Grid>
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
            id="NameReg"
            type="name"
            label="Name"
            variant="filled"
          ></TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            className={styles.textField}
            required
            id="NameReg"
            type="name"
            label="Surname"
            variant="filled"
          ></TextField>
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset" className={styles.textField}>
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              // value={value}
              // onChange={handleChange}
            >
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset" className={styles.textField}>
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              // value={value}
              // onChange={handleChange}
            >
              <FormControlLabel
                value="passport"
                control={<Radio />}
                label="Passport"
              />
              <FormControlLabel
                value="IDcard"
                control={<Radio />}
                label="Id Card"
              />
              <FormControlLabel value="None" control={<Radio />} label="None" />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            className={styles.textField}
            required
            id="PESELReg"
            type="number"
            label="PESEL"
            variant="filled"
          ></TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            className={styles.textField}
            required
            id="DateReg"
            type="date"
            label="Date of birth"
            variant="filled"
          ></TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            className={styles.textField}
            required
            id="CountryReg"
            type="text"
            label="Country"
            variant="filled"
          ></TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            className={styles.textField}
            required
            id="PostalCodeReg"
            type="postalCode"
            label="Postal code"
            variant="filled"
          ></TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            className={styles.textField}
            required
            id="CityReg"
            type="text"
            label="City"
            variant="filled"
          ></TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            className={styles.textField}
            required
            id="AddressReg"
            type="text"
            label="Address"
            variant="filled"
          ></TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            className={styles.textField}
            required
            id="PhoneReg"
            type="phone"
            label="Phone number"
            variant="filled"
          ></TextField>
        </Grid>
        <Grid item xs={12}>
          <div className={styles.buttonGeneralBox}>
            <div className={styles.buttonBox}>
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

export default RegisterPage;
