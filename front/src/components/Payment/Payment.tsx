import { Button, Grid } from "@material-ui/core";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DecodedToken from "../../models/DecodedToken";
import { RootState } from "../../redux";
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
    // eslint-disable-next-line
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
