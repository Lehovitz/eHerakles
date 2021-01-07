import { Button, Grid, Typography } from "@material-ui/core";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DecodedToken from "../../models/DecodedToken";
import { RootState } from "../../redux";
import PaperWithHeader from "../Shared/PaperWithHeader/PaperWithHeader";
import styles from "../Payment/Payment.module.scss";
import DateTransformation from "../../utils/DateTransformation";

type Payment = {
  id: string;
  due: number;
  dueDate: Date;
  paymentDate: Date;
  status: Status;
  period: number;
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
  period: number;
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
  }, []);

  const statusTransform = (x: Status) => {
    switch (x) {
      case Status.Started: {
        return "Started";
      }
      case Status.Pending: {
        return "Pending";
      }
      case Status.Finalized: {
        return "Finalized";
      }
      case Status.Rejected: {
        return "Rejected";
      }
      default:
        return "Unknown";
    }
  };

  return (
    <PaperWithHeader headerText="All payments">
      <Grid container spacing={3}>
        <Grid item xs={2} className={styles.header}>
          Due date
        </Grid>
        <Grid item xs={2} className={styles.header}>
          Status
        </Grid>
        <Grid item xs={3} className={styles.header}>
          Due ammount
        </Grid>
        <Grid item xs={3} className={styles.header}>
          Payment date
        </Grid>
        <Grid item xs={2}></Grid>
        {payments && payments.length > 0 ? (
          payments.map((payment) => (
            <React.Fragment key={payment.id}>
              <Grid item xs={3}>
                {DateTransformation(payment.dueDate)}
              </Grid>
              <Grid item xs={2}>
                {statusTransform(payment.status)}
              </Grid>
              <Grid item xs={2}>
                {payment.due}
              </Grid>
              <Grid item xs={3}>
                {DateTransformation(payment.paymentDate)}
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => sendPayment(payment.id)}
                >
                  Send Payment
                </Button>
              </Grid>
            </React.Fragment>
          ))
        ) : (
          <Typography>
            Couldn't find payments info, probably there aren't any.
          </Typography>
        )}{" "}
      </Grid>
    </PaperWithHeader>
  );
};

export default Payment;
