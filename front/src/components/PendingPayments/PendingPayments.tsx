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
  email: String;
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

const PendingPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    (async () => {
      const res: PaymentBack[] = await fetch(
        `http://localhost:5000/payments/getPending`
      ).then((res) => res.json());

      const result = res.map((payment) => ({
        ...payment,
        email: payment.customer.email,
      }));
      setPayments(result);
    })();
  }, []);

  const acceptPayment = async (id: String) => {
    await fetch(`http://localhost:5000/payments/accept/${id}`, {
      method: "PUT",
    });
    const paymentsCopy = [...payments];
    const index = payments.findIndex((payment) => payment.id === id);
    paymentsCopy.splice(index, 1);
    setPayments(paymentsCopy);
  };
  const rejectPayment = async (id: String) => {
    await fetch(`http://localhost:5000/payments/reject/${id}`, {
      method: "PUT",
    });
    const paymentsCopy = [...payments];
    const index = payments.findIndex((payment) => payment.id === id);
    paymentsCopy.splice(index, 1);
    setPayments(paymentsCopy);
  };

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
            <Button color="primary" onClick={() => acceptPayment(payment.id)}>
              Accept
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button color="secondary" onClick={() => rejectPayment(payment.id)}>
              Reject
            </Button>
          </Grid>
        </Grid>
      ))}
    </PaperWithHeader>
  );
};

export default PendingPayments;
