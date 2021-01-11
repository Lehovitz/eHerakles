import { Button, Grid, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import PaperWithHeader from "../Shared/PaperWithHeader/PaperWithHeader";
import DateTransformation from "../../utils/DateTransformation";
import styles from "../PendingPayments/PendingPayments.module.scss";

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
    <PaperWithHeader headerText="Pending payments">
      <Grid container spacing={3}>
        <Grid item xs={3} className="header" style={{ fontWeight: `bold` }}>
          Due
        </Grid>
        <Grid item xs={4} className="header" style={{ fontWeight: `bold` }}>
          Email
        </Grid>
        <Grid item xs={3} className="header" style={{ fontWeight: `bold` }}>
          Payment date
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      {payments && payments.length > 0 ? (
        payments.map((payment) => (
          <React.Fragment key={payment.id}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                {payment.due + " PLN"}
              </Grid>

              <Grid item xs={4}>
                {payment.email}
              </Grid>
              <Grid item xs={3}>
                {DateTransformation(payment.paymentDate)}
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={4}></Grid>
              <Grid item xs={4}></Grid>

              {/* <Grid item xs={2}>
              {payment.status}
            </Grid> */}
              <Grid item xs={2}>
                <Button
                  color="primary"
                  onClick={() => acceptPayment(payment.id)}
                  variant="contained"
                >
                  Accept
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Button
                  color="secondary"
                  onClick={() => rejectPayment(payment.id)}
                  variant="contained"
                >
                  Reject
                </Button>
              </Grid>
            </Grid>
          </React.Fragment>
        ))
      ) : (
        <Typography>
          Couldn't find payments info, probably there aren't any.
        </Typography>
      )}
    </PaperWithHeader>
  );
};

export default PendingPayments;
