import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import { TextField } from "material-ui";

import React, { Component, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const BMICalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [activity, setActivity] = useState("");
  const [age, setAge] = useState("");
  const [bmr, setBmr] = useState(0.0);
  const [bmrExt, setBmrExt] = useState(1.0);
  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value);
  };
  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(event.target.value);
  };
  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(event.target.value);
  };

  const handleActivityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActivity(event.target.value);
  };
  const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAge(event.target.value);
  };

  useEffect(() => {
    switch (activity) {
      case "none":
        setBmrExt(bmr * 1.2);
        break;
      case "light":
        setBmrExt(bmr * 1.375);
        break;
      case "moderate":
        setBmrExt(bmr * 1.55);
        break;
      case "very":
        setBmrExt(bmr * 1.725);
        break;
      case "extreme":
        setBmrExt(bmr * 1.9);
        break;
      default:
        setBmrExt(bmr);
    }
  });

  const handleCountClick = () => {
    if (gender === "male") {
      setBmr(
        66.47 +
          13.75 * parseFloat(weight) +
          5.003 * parseFloat(height) -
          6.755 * parseFloat(age)
      );
    } else if (gender === "female") {
      setBmr(
        655.1 +
          9.563 * parseFloat(weight) +
          1.85 * parseFloat(height) -
          4.676 * parseFloat(age)
      );
    }
  };
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Count your BMI</FormLabel>
            <RadioGroup
              aria-label="Gender"
              name="gender"
              onChange={handleGenderChange}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Activity</FormLabel>
            <RadioGroup
              aria-label="Activity"
              name="docType"
              onChange={handleActivityChange}
            >
              <FormControlLabel
                value="none"
                control={<Radio />}
                label="Little/NoExercise"
              />
              <FormControlLabel
                value="light"
                control={<Radio />}
                label="Light exercise"
              />
              <FormControlLabel
                value="moderate"
                control={<Radio />}
                label="Moderate exercise (3-5 days/wk)"
              />
              <FormControlLabel
                value="very"
                control={<Radio />}
                label="Very active (6-7 days/wk)"
              />
              <FormControlLabel
                value="extreme"
                control={<Radio />}
                label="Extra active (6-7 days/wk and physical job)"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <h1>Age</h1>
          <TextField id="age" type="number" onChange={handleAgeChange} />
        </Grid>
        <Grid item xs={12}>
          <h1>Weight [kg]</h1>
          <TextField id="weight" type="number" onChange={handleWeightChange} />
        </Grid>
        <Grid item xs={12}>
          <h1>Height [cm]</h1>
          <TextField id="height" type="number" onChange={handleHeightChange} />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCountClick}
          >
            Count BMR
          </Button>
        </Grid>
        {bmr > 0.0 && (
          <Grid item xs={12}>
            <Typography>
              Your Basal Metabolic Rate is: {bmr.toFixed()} kcal
            </Typography>
            <Typography>
              Including your activity your daily consumption should be:{" "}
              {bmrExt.toFixed()}
              kcal
            </Typography>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default BMICalculator;
