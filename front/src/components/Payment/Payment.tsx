import { Box, Button, Grid, MuiThemeProvider } from "@material-ui/core";
import jwtDecode from "jwt-decode";
import { Checkbox, SelectField, TextField } from "material-ui";
import React, { Component, useEffect, useState } from "react";
import styles from "./Payment.module.scss";
import faker from "faker";
import nodemailer from "nodemailer";
import {
  BooleanField,
  DateField,
  NumberField,
  useAuthState,
} from "react-admin";
import { useSelector } from "react-redux";
import DecodedToken from "../../models/DecodedToken";
import { RootState } from "../../redux";
import { stringify } from "querystring";
import PaperWithHeader from "../Shared/PaperWithHeader/PaperWithHeader";

type Card = {
  id: number;
  subType: string;
  due: number;
  expDate: Date;
  isActive: boolean;
};

type Person = {
  id: number;
  name: string;
  surname: string;
};
type Customer = {
  id: number;
  person: Person;
};

const Payment = () => {
  const [card, setCard] = useState<Card>();
  const [cust, setCust] = useState<Customer>();
  const bearerToken = useSelector((state: RootState) => state.token),
    decodedToken: DecodedToken | undefined =
      bearerToken.token.length > 0 ? jwtDecode(bearerToken.token) : undefined;
  const email = decodedToken?.email;
  const id = decodedToken?.id;

  useEffect(() => {
    (async () => {
      const res: Card = await fetch(
        `http://localhost:5000/cards/findByEmail/${email!.replace("@", "%40")}`
      ).then((res) => res.json());
      setCard(res);
    })();
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     const res: Customer = await fetch(
  //       `http://localhost:5000/customers/findByEmail/${email!.replace(
  //         "@",
  //         "%40"
  //       )}`
  //     ).then((res) => res.json());
  //     setCust(res);
  //   })();
  // }, []);A

  const sendPayment = async () => {
    await fetch(`http://localhost:5000/emails/${id}`).then((res) => res.json());
  };

  return (
    <PaperWithHeader headerText="Payments">
      <Grid container spacing={3}>
        <Grid item xs={4} className={styles.textField}>
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
          <Button className={styles.button} onClick={sendPayment}>
            Payment
          </Button>
        </Grid>
      </Grid>
    </PaperWithHeader>
  );
};

export default Payment;
