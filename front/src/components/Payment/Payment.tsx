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

type Payment = {
  id: string;
  due: number;
  dueDate: Date;
  paymentDate: Date;
  status: Status;
  email: string;
};

enum Status {
  Started = "S",
  Pending = "P",
  Finalized = "F",
  Rejected = "R",
}

type PaymentBack = {
  id: string;
  due: number;
  dueDate: Date;
  paymentDate: Date;
  status: Status;
  customer: { email: string };
};

const Payment = () => {
  const [payments, setPayments] = useState<Payment[]>([]);

  const bearerToken = useSelector((state: RootState) => state.token),
    decodedToken: DecodedToken | undefined =
      bearerToken.token.length > 0 ? jwtDecode(bearerToken.token) : undefined;
  const email = decodedToken!.email;
  const id = decodedToken!.id;

  const sendPayment = async (paymId: string) => {
    await fetch(`http://localhost:5000/emails/${paymId}`);
    await fetch(`http://localhost:5000/payments/pend/${paymId}`, {
      method: "PUT",
    });
  };

  useEffect(() => {
    (async () => {
      const res: PaymentBack[] = await fetch(
        `http://localhost:5000/payments/findByEmail/${email}`
      ).then((res) => res.json());

      const result = res.map((payment) => ({
        ...payment,
        email: email,
      }));
      setPayments(result);
    })();
  }, []);

  return (
    <PaperWithHeader headerText="All payments">
      {payments.map((payment) => (
        <Grid key={payment.id} container spacing={3}>
          <Grid item xs={2}>
            {payment.id}
          </Grid>
          <Grid item xs={2}>
            {payment.due}
          </Grid>
          <Grid item xs={2}>
            {payment.dueDate}
          </Grid>
          <Grid item xs={2}>
            {payment.email}
          </Grid>
          <Grid item xs={2}>
            {payment.paymentDate}
          </Grid>
          <Grid item xs={2}>
            {payment.status}
          </Grid>
          <Grid item xs={2}>
            <Button color="primary" onClick={() => sendPayment(payment.id)}>
              Send Payment
            </Button>
          </Grid>
        </Grid>
      ))}
    </PaperWithHeader>
  );
};

export default Payment;
