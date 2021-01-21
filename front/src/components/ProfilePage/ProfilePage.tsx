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
import Alert from "@material-ui/lab/Alert";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import DecodedToken from "../../models/DecodedToken";
import { RootState } from "../../redux";
import DateTransformation from "../../utils/DateTransformation";
import StringToFormattedDate from "../../utils/StringToFormattedDate";
import PaperWithHeader from "../Shared/PaperWithHeader/PaperWithHeader";
import styles from "./ProfilePage.module.scss";

type Data = {
  name: string;
  surname: string;
  gender: string;
  pesel: string;
  birthDate: string;
  country: string;
  postalCode: string;
  city: string;
  address: string;
  phoneNum: string;
  goal: string;
};

type Customer = {
  id: string;
  email: string;
  person: Person;
};
type Location = {
  id: string;
  country: string;
  city: string;
  postalCode: string;
};

type Person = {
  id: string;
  surname: string;
  name: string;
  gender: string;
  birthDate: string;
  phoneNum: string;
  pesel: string;
  address: string;
  location: Location;
};
const ProfilePage = () => {
  const [redirect, setRedirect] = useState(false),
    [error, setError] = useState(""),
    [name, setName] = useState(""),
    [alert, setAlert] = useState(false),
    [surname, setSurname] = useState(""),
    [gender, setGender] = useState(""),
    [pesel, setPesel] = useState(""),
    [birthDate, setDateOfBirth] = useState("1994-01-01"),
    [country, setCountry] = useState(""),
    [postalCode, setPostalCode] = useState(""),
    [city, setCity] = useState(""),
    [address, setAddress] = useState(""),
    [phoneNum, setPhoneNum] = useState(""),
    [goal, setGoal] = useState(""),
    [allow, setAllow] = useState("STOP"),
    [data, setData] = useState<Data>({
      address: "",
      name: "",
      surname: "",
      city: "",
      country: "",
      postalCode: "",
      gender: "",
      pesel: "",
      birthDate: "",
      phoneNum: "",
      goal: "",
    });

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

  // const namePattern = `/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u`;
  // const peselPattern = `^\d{11}$`;
  // const cityPattern = `^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$`;
  // const countryPattern = `^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$`;

  // const validateFields = () => {
  //   var Regex = require("regex");
  //   var regex = new Regex(namePattern);
  //   let result = true;
  //   result = regex.test(name);
  //   return result;
  // };

  useEffect(() => {
    (async () => {
      const res: Data = await fetch(
        `http://localhost:5000/customers/${id}`
      ).then((res) => res.json());
      console.log(res);
      setData({
        address: res.address,
        name: res.name,
        surname: res.surname,
        city: res.city,
        country: res.country,
        postalCode: res.postalCode,
        gender: res.gender,
        pesel: res.pesel,
        birthDate: res.birthDate,
        phoneNum: res.phoneNum,
        goal: res.goal,
      });

      setAddress(res.address);
      setName(res.name);
      setSurname(res.surname);
      setCity(res.city);
      setCountry(res.country);
      setPostalCode(res.postalCode);
      setGender(res.gender);
      setPesel(res.pesel);
      setDateOfBirth(res.birthDate);
      setPhoneNum(res.phoneNum);
      setGoal(res.goal);

      console.log(data);

      setAllow("GO");
    })();
  }, []);

  const checkIfDataIsComplete = () => {
    if (
      name !== "" &&
      surname !== "" &&
      gender !== "" &&
      pesel !== "" &&
      birthDate !== "" &&
      country !== "" &&
      postalCode !== "" &&
      city !== "" &&
      address !== "" &&
      phoneNum !== "" &&
      goal !== ""
    ) {
      console.log("true");
      return true;
    } else {
      console.log("false");
      return false;
    }
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
      setAlert(true);
    } else {
      setError(responseText);
    }
  };

  return (
    <PaperWithHeader headerText="Your profile info">
      {redirect && <Redirect to="/"></Redirect>}
      {alert && <Alert severity="success">Profile completed!</Alert>}
      {allow === "GO" && (
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
              defaultValue={data.name}
            ></TextField>

            <TextField
              className={styles.textField}
              required
              type="name"
              label="Surname"
              variant="outlined"
              onChange={handleSurnameChange}
              defaultValue={data.surname}
            ></TextField>
            <TextField
              className={styles.textField}
              required
              type="date"
              label="Date of birth"
              variant="outlined"
              onChange={handleDateOfBirthChange}
              defaultValue={StringToFormattedDate(new Date(data.birthDate))}
            ></TextField>
            <div className={styles.divv}>
              <TextField
                className={styles.textFieldWithMargin}
                required
                id="PESELReg"
                label="PESEL"
                variant="outlined"
                onChange={handlePeselChange}
                defaultValue={data.pesel}
              ></TextField>
            </div>
            <FormControl component="fieldset" required>
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
                defaultValue={data.goal}
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
              defaultValue={data.phoneNum}
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
              defaultValue={data.country}
            ></TextField>
            <TextField
              className={styles.textField}
              required
              id="CityReg"
              type="text"
              label="City"
              variant="outlined"
              onChange={handleCityChange}
              defaultValue={data.city}
            ></TextField>

            <TextField
              className={styles.textField}
              required
              id="AddressReg"
              type="text"
              label="Address"
              variant="outlined"
              onChange={handleAddressChange}
              defaultValue={data.address}
            ></TextField>

            <TextField
              className={styles.textField}
              required
              id="PostalCodeReg"
              type="postalCode"
              label="Postal code"
              variant="outlined"
              onChange={handlePostalCodeChange}
              defaultValue={data.postalCode}
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
                defaultValue={data.gender}
              >
                <FormControlLabel
                  value="F"
                  control={<Radio />}
                  label="Female"
                />
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
              disabled={!checkIfDataIsComplete()}
            >
              Confirm
            </Button>
          </Grid>
        </Grid>
      )}
    </PaperWithHeader>
  );
};

export default ProfilePage;
