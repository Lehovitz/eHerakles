import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";

import React, { Component, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PaperWithHeader from "../Shared/PaperWithHeader/PaperWithHeader";

const BMICalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [bmi, setBmi] = useState(0.0);
  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value);
  };
  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(event.target.value);
  };
  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(event.target.value);
  };
  const handleCountClick = () => {
    setBmi(parseFloat(weight) / (parseFloat(height) / 100) ** 2);
  };
  return (
    <PaperWithHeader headerText="Count your BMI">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              aria-label="Gender"
              name="docType"
              onChange={handleGenderChange}
            >
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="Female"
                control={<Radio />}
                label="Female"
              />
            </RadioGroup>
          </FormControl>
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
            Count BMI
          </Button>
        </Grid>
        {bmi > 0.0 && bmi < 18.5 && (
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              Your body mass index is: {bmi.toFixed()}
            </Typography>
            <Typography> and your body seems to be underweight.</Typography>
          </Grid>
        )}
        {bmi > 18.5 && bmi < 24.9 && (
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              Your body mass index is: {bmi.toFixed()}
            </Typography>
            <Typography> and your body seems to be normal.</Typography>
          </Grid>
        )}
        {bmi > 25 && bmi < 29.9 && (
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              Your body mass index is: {bmi.toFixed()}
            </Typography>

            <Typography variant="subtitle1">
              and your body seems to be overweight.
            </Typography>
          </Grid>
        )}
        {bmi > 30 && bmi < 24.9 && (
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              Your body mass index is: {bmi.toFixed()}
            </Typography>
            <Typography> and your body seems to be obese.</Typography>
          </Grid>
        )}
        {bmi > 35 && (
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              Your body mass index is: {bmi.toFixed()}
            </Typography>
            <Typography> and your body seems to be extremely obese.</Typography>
          </Grid>
        )}
      </Grid>
    </PaperWithHeader>
  );
};

export default BMICalculator;
