import { Button, Grid, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import PaperWithHeader from "../Shared/PaperWithHeader/PaperWithHeader";

type Subscription = {
  id: number;
  period: number;
  name: string;
  cost: number;
};

type Card = {
  id: number;
  isActive: boolean;
  due: Number;
  expDate: Date;
  subscription: Subscription;
  // TODcustomer??
};

const Card = () => {
  const [card, setCard] = useState<Card>();

  useEffect(() => {
    (async () => {
      const res: Card = await fetch(
        `http://localhost:5000/cards/findByCustomer`
      ).then((res) => res.json());

      const result = {
        ...res,
        name: res.subscription.name,
      };
      setCard(result);
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
      {payments && payments.length > 0 ? (
        payments.map((payment) => (
          <Grid key={payment.id} container spacing={3}>
            {/* <Grid item xs={2}>
            {payment.id}
          </Grid> */}
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
              <Button
                color="secondary"
                onClick={() => rejectPayment(payment.id)}
              >
                Reject
              </Button>
            </Grid>
          </Grid>
        ))
      ) : (
        <Typography>
          Couldn't find payments info, probably there aren't any.
        </Typography>
      )}
    </PaperWithHeader>
  );
};

export default Card;
