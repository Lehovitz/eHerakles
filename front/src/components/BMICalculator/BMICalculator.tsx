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

import React, { useState } from "react";
import PaperWithHeader from "../Shared/PaperWithHeader/PaperWithHeader";

const BMICalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [, setGender] = useState("");
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
              name="gender"
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
            <Typography
              variant="subtitle1"
              style={{ fontWeight: "bold", color: "red" }}
            >
              Your body mass index is: {bmi.toFixed()}
            </Typography>
            <Typography style={{ fontWeight: "bold", color: "red" }}>
              {" "}
              and your body seems to be underweight.
            </Typography>
          </Grid>
        )}
        {bmi > 18.5 && bmi < 24.9 && (
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              style={{ fontWeight: "bold", color: "green" }}
            >
              Your body mass index is: {bmi.toFixed()}
            </Typography>
            <Typography style={{ fontWeight: "bold", color: "green" }}>
              {" "}
              and you are witin the norm. Keep going!
            </Typography>
          </Grid>
        )}
        {bmi > 25 && bmi < 29.9 && (
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              style={{ fontWeight: "bold", color: "blue" }}
            >
              Your body mass index is: {bmi.toFixed()}
            </Typography>

            <Typography
              variant="subtitle1"
              style={{ fontWeight: "bold", color: "blue" }}
            >
              and your body seems to be overweight.
            </Typography>
          </Grid>
        )}
        {bmi > 30 && bmi < 24.9 && (
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              style={{ fontWeight: "bold", color: "orange" }}
            >
              Your body mass index is: {bmi.toFixed()}
            </Typography>
            <Typography style={{ fontWeight: "bold", color: "orange" }}>
              {" "}
              and your body seems to be obese.
            </Typography>
          </Grid>
        )}
        {bmi > 35 && (
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              style={{ fontWeight: "bold", color: "red" }}
            >
              Your body mass index is: {bmi.toFixed()}
            </Typography>
            <Typography style={{ fontWeight: "bold", color: "red" }}>
              {" "}
              and your body seems to be extremely obese. U should see the
              dietician as fast as possible.
            </Typography>
          </Grid>
        )}
      </Grid>
    </PaperWithHeader>
  );
};

export default BMICalculator;
