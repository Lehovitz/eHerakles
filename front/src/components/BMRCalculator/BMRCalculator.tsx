import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
  TextField,
} from "@material-ui/core";

import React, { useEffect, useState } from "react";
import PaperWithHeader from "../Shared/PaperWithHeader/PaperWithHeader";

const BMRCalculator = () => {
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
  }, [bmr, activity]);

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
    <PaperWithHeader headerText="Count your BMR">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Gender</FormLabel>
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
            <RadioGroup aria-label="Activity" onChange={handleActivityChange}>
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
          <TextField
            id="age"
            type="number"
            onChange={handleAgeChange}
            label="Age"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="weight"
            type="number"
            onChange={handleWeightChange}
            label="Weight [kg]"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="height"
            type="number"
            onChange={handleHeightChange}
            label="Height [cm]"
          />
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
            <Typography style={{ fontWeight: "bold" }}>
              Your Basal Metabolic Rate is: {bmr.toFixed()} kcal
            </Typography>
            <Typography style={{ fontWeight: "bold" }}>
              Including your activity your daily consumption should be:
              {bmrExt.toFixed()}
              kcal
            </Typography>
          </Grid>
        )}
      </Grid>
    </PaperWithHeader>
  );
};

export default BMRCalculator;
