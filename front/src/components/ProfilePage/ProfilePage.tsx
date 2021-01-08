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
import jwtDecode from "jwt-decode";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import DecodedToken from "../../models/DecodedToken";
import { RootState } from "../../redux";
import PaperWithHeader from "../Shared/PaperWithHeader/PaperWithHeader";
import styles from "./ProfilePage.module.scss";

const ProfilePage = () => {
  const [redirect, setRedirect] = useState(false),
    [, setError] = useState(""),
    [name, setName] = useState(""),
    [surname, setSurname] = useState(""),
    [gender, setGender] = useState(""),
    [pesel, setPesel] = useState(""),
    [birthDate, setDateOfBirth] = useState("2020-01-01"),
    [country, setCountry] = useState(""),
    [postalCode, setPostalCode] = useState(""),
    [city, setCity] = useState(""),
    [address, setAddress] = useState(""),
    [phoneNum, setPhoneNum] = useState(""),
    [goal, setGoal] = useState("");

  const bearerToken = useSelector((state: RootState) => state.token),
    decodedToken: DecodedToken | undefined =
      bearerToken.token.length > 0 ? jwtDecode(bearerToken.token) : undefined;
  const id = decodedToken!.id;

  const handleGoalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGoal(event.target.value);
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

  const handleSaveButtonClick = async () => {
    const response = await fetch(
      `http://localhost:5000/customers/profileInfo/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          country,
          city,
          postalCode,
          name,
          surname,
          gender,
          birthDate,
          phoneNum,
          pesel,
          address,
          goal,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseText = await response.text();
    if (response.ok) {
    } else {
      setError(responseText);
    }
  };

  return (
    <PaperWithHeader headerText="Your profile info">
      {redirect && <Redirect to="/"></Redirect>}
      <Grid container spacing={2} className={styles.container}>
        <Grid item xs={12} className={styles.alertBox}></Grid>
        <Grid item xs={6}>
          <TextField
            className={styles.textField}
            required
            type="name"
            label="Name"
            variant="outlined"
            onChange={handleNameChange}
          ></TextField>

          <TextField
            className={styles.textField}
            required
            type="name"
            label="Surname"
            variant="outlined"
            onChange={handleSurnameChange}
          ></TextField>
          <TextField
            className={styles.textField}
            required
            type="date"
            label="Date of birth"
            variant="outlined"
            defaultValue={birthDate}
            onChange={handleDateOfBirthChange}
          ></TextField>

          <TextField
            className={styles.textField}
            required
            id="PESELReg"
            label="PESEL"
            variant="outlined"
            onChange={handlePeselChange}
          ></TextField>
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              style={{ borderBottom: `0px`, color: `black` }}
            >
              Your goal
            </FormLabel>
            <RadioGroup
              className={styles.radio}
              aria-label="goal"
              name="goal"
              onChange={handleGoalChange}
              // value={value}
              // onChange={handleChange}
            >
              <FormControlLabel
                value="M"
                control={<Radio />}
                label="Gaining mass"
              />
              <FormControlLabel
                value="Fit"
                control={<Radio />}
                label="Getting fit"
              />
              <FormControlLabel
                value="Rd"
                control={<Radio />}
                label="Weight reduction"
              />
              <FormControlLabel
                value="Rel"
                control={<Radio />}
                label="Relaxation"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <TextField
            className={styles.textField}
            required
            id="PhoneReg"
            type="phone"
            label="Phone number"
            variant="outlined"
            onChange={handlePhoneNumberChange}
          ></TextField>

          <TextField
            className={styles.textField}
            required
            id="CountryReg"
            type="text"
            label="Country"
            variant="outlined"
            onChange={handleCountryChange}
          ></TextField>
          <TextField
            className={styles.textField}
            required
            id="CityReg"
            type="text"
            label="City"
            variant="outlined"
            onChange={handleCityChange}
          ></TextField>

          <TextField
            className={styles.textField}
            required
            id="AddressReg"
            type="text"
            label="Address"
            variant="outlined"
            onChange={handleAddressChange}
          ></TextField>

          <TextField
            className={styles.textField}
            required
            id="PostalCodeReg"
            type="postalCode"
            label="Postal code"
            variant="outlined"
            onChange={handlePostalCodeChange}
          ></TextField>
          <FormControl component="fieldset" className={styles.textField}>
            <FormLabel
              component="legend"
              style={{ borderBottom: `0px`, color: `black` }}
            >
              Gender
            </FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              onChange={handleGenderChange}
            >
              <FormControlLabel value="F" control={<Radio />} label="Female" />
              <FormControlLabel value="M" control={<Radio />} label="Male" />
              <FormControlLabel value="O" control={<Radio />} label="Other" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={4} />
        <Grid item xs={4} />

        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveButtonClick}
          >
            Confirm
          </Button>
        </Grid>
      </Grid>
    </PaperWithHeader>
  );
};

export default ProfilePage;
