import { Box, Button, Grid, MuiThemeProvider } from "@material-ui/core";
import jwtDecode from "jwt-decode";
import { Checkbox, SelectField, TextField } from "material-ui";
import React, { Component, useEffect, useState } from "react";
import styles from "./Payment.module.scss";
import {
  BooleanField,
  DateField,
  NumberField,
  useAuthState,
} from "react-admin";
import { useSelector } from "react-redux";
import DecodedToken from "../../models/DecodedToken";
import { RootState } from "../../redux";

type Card = {
  id: number;
  subType: string;
  due: number;
  expDate: Date;
  isActive: boolean;
};

const Payment = () => {
  // const [subType, setSubType] = useState("");
  // const [due, setDue] = useState(0);
  // const [expDate, setExpDate] = useState(new Date());
  // const [isActive, setIsActive] = useState(false);
  const [card, setCard] = useState<Card>();
  const bearerToken = useSelector((state: RootState) => state.token),
    decodedToken: DecodedToken | undefined =
      bearerToken.token.length > 0 ? jwtDecode(bearerToken.token) : undefined;
  const email = decodedToken?.email;

  useEffect(() => {
    (async () => {
      const res: Card = await fetch(
        `http://localhost:5000/cards/findByEmail/${email!.replace("@", "%40")}`
      ).then((res) => res.json());
      setCard(res);
    })();
  }, []);

  return (
    <div className={styles.mainContainer}>
      <Grid container spacing={3} className={styles.container}>
        <Grid item xs={2} className={styles.textField}>
          <div className={styles.label}>SubscriptionType</div>
          <div>{card?.subType}</div>
        </Grid>
        <Grid item xs={2} className={styles.textField}>
          <div className={styles.label}>Due</div>
          <div>{card?.due}</div>
        </Grid>
        <Grid item xs={2} className={styles.textField}>
          <div className={styles.label}>Expire date</div>
          <div>{card?.expDate.toString().split("T")[0]}</div>
        </Grid>
        <Grid item xs={2} className={styles.textField}>
          <div className={styles.label}>isActive</div>
          <div>
            <Checkbox checked={card?.isActive}></Checkbox>
          </div>
        </Grid>
        <Grid item xs={2} className={styles.textField}>
          <Button className={styles.button}>Payment</Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Payment;
