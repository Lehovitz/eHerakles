import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { TextField } from "material-ui";

import React, { Component, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const BMICalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value);
  };
  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(event.target.value);
  };
  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(event.target.value);
  };
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Count your BMI</FormLabel>
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
          <h1>Weight</h1>
          <TextField id="weight" type="number" onChange={handleWeightChange} />
        </Grid>
        <Grid item xs={12}>
          <h1>Height</h1>
          <TextField id="height" type="number" onChange={handleHeightChange} />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary">
            Count BMI
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default BMICalculator;
