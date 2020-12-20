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
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import styles from "./RegisterPage.module.scss";

const RegisterPage = () => {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [redirect, setRedirect] = useState(false),
    [, setError] = useState(""),
    [name, setName] = useState(""),
    [surname, setSurname] = useState(""),
    [gender, setGender] = useState(""),
    [docType, setDocType] = useState(""),
    [docNumber, setDocNumber] = useState(""),
    [pesel, setPesel] = useState(""),
    [birthDate, setDateOfBirth] = useState("2020-01-01"),
    [country, setCountry] = useState(""),
    [postalCode, setPostalCode] = useState(""),
    [city, setCity] = useState(""),
    [address, setAddress] = useState(""),
    [phoneNum, setPhoneNum] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleSurnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSurname(event.target.value);
  };
  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value);
  };
  const handleDocTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDocType(event.target.value);
  };
  const handleDocNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDocNumber(event.target.value);
  };
  const handlePeselChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPesel(event.target.value);
  };
  const handleDateOfBirthChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDateOfBirth(event.target.value);
  };
  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCountry(event.target.value);
  };
  const handlePostalCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPostalCode(event.target.value);
  };
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };
  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };
  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPhoneNum(event.target.value);
  };

  const validateMail = () => {
    var re = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
    return re.test(email);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleRegisterClick = async () => {
    console.log(
      JSON.stringify({
        email,
        password,
        country,
        city,
        postalCode,
        name,
        surname,
        gender,
        docType,
        birthDate,
        phoneNum,
        pesel,
        docNumber,
        address,
      })
    );
    const response = await fetch("http://localhost:5000/customers/", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        country,
        city,
        postalCode,
        name,
        surname,
        gender,
        docType,
        birthDate,
        phoneNum,
        pesel,
        docNumber,
        address,
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
            error={email !== "" && !validateMail()}
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
            onChange={handleNameChange}
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
            onChange={handleSurnameChange}
          ></TextField>
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset" className={styles.textField}>
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              onChange={handleGenderChange}
              // value={value}
              // onChange={handleChange}
            >
              <FormControlLabel value="F" control={<Radio />} label="Female" />
              <FormControlLabel value="M" control={<Radio />} label="Male" />
              <FormControlLabel value="O" control={<Radio />} label="Other" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset" className={styles.textField}>
            <FormLabel component="legend">Document type</FormLabel>
            <RadioGroup
              aria-label="Document type"
              name="docType"
              onChange={handleDocTypeChange}
            >
              <FormControlLabel
                value="Passport"
                control={<Radio />}
                label="Passport"
              />
              <FormControlLabel
                value="IdCard"
                control={<Radio />}
                label="Id Card"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            className={styles.textField}
            required
            id="DocNumber"
            label="DocNumber"
            variant="filled"
            onChange={handleDocNumberChange}
          ></TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            className={styles.textField}
            required
            id="PESELReg"
            label="PESEL"
            variant="filled"
            onChange={handlePeselChange}
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
            defaultValue={birthDate}
            onChange={handleDateOfBirthChange}
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
            onChange={handleCountryChange}
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
            onChange={handlePostalCodeChange}
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
            onChange={handleCityChange}
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
            onChange={handleAddressChange}
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
            onChange={handlePhoneNumberChange}
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
