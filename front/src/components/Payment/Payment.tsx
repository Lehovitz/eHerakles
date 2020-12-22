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
  // const [subType, setSubType] = useState("");
  // const [due, setDue] = useState(0);
  // const [expDate, setExpDate] = useState(new Date());
  // const [isActive, setIsActive] = useState(false);
  const [card, setCard] = useState<Card>();
  const [cust, setCust] = useState<Customer>();
  const [person, setPerson] = useState<Person>();
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

  useEffect(() => {
    (async () => {
      const res: Customer = await fetch(
        `http://localhost:5000/customers/findByEmail/${email!.replace(
          "@",
          "%40"
        )}`
      ).then((res) => res.json());
      setCust(res);
    })();
  }, []);

  const sendPayment = () => {
    const fvNum = "FV " + faker.random.number({ min: 1000, max: 99999 });

    console.log(fvNum);
    console.log(cust);
    var mailOptions = {
      from: "eHerakles",
      to: "michallechowicz14@gmail.com",
      subject: "Payment",
      text: "Hello" + cust!.person.name + " " + cust!.person.surname,
    };
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "eHeraklesTeam@gmail.com",
        pass: "pass@word1",
      },
    });
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  };

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
          <Button className={styles.button} onClick={sendPayment}>
            Payment
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Payment;
