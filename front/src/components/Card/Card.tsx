import {
  Button,
  FormControl,
  Grid,
  Typography,
  Select,
  Checkbox,
} from "@material-ui/core";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DecodedToken from "../../models/DecodedToken";
import { RootState } from "../../redux";
import PaperWithHeader from "../Shared/PaperWithHeader/PaperWithHeader";
import ConfirmDialog from "./ConfirmDialog";
import styles from "./Card.module.scss";
import DateTransformation from "../../utils/DateTransformation";

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
  subName: string;
  subId: number;
  customer: { id: string; email: string };
};

type Selections = {
  value: number;
  label: string;
};

enum Status {
  Started = "S",
  Pending = "P",
  Finalized = "F",
  Rejected = "R",
}

type Payment = {
  id: string;
  due: number;
  dueDate: Date;
  paymentDate: Date;
  status: Status;
  customer: { email: string };
  period: number;
};

const Card = () => {
  const bearerToken = useSelector((state: RootState) => state.token),
    decodedToken: DecodedToken | undefined =
      bearerToken.token.length > 0 ? jwtDecode(bearerToken.token) : undefined;
  const email = decodedToken!.email;

  const [card, setCard] = useState<Card>();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subNames, setSubNames] = useState<Selections[]>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Selections>();
  const [selected, setSelected] = useState("");
  const [customerVerification, setCustomerVerification] = useState(false);

  const handleSelectionChange = (event: any) => {
    setSelected(event.target.value);
  };
  const handleCardCreation = async () => {
    const res: Card = await fetch(`http://localhost:5000/cards/createWithSub`, {
      method: "POST",
      body: JSON.stringify({
        custId: decodedToken!.id,
        subId: selected,
      }),
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
    setCard(res);
    handleSubscriptionChange();
  };

  const handleSubscriptionChange = async () => {
    setOpen(false);
    //znalezienie suba
    const sub: Subscription = await fetch(
      `http://localhost:5000/subscriptions/${selected}`
    ).then((res) => res.json());

    //generowanie platnosci
    const res: Payment = await fetch(
      `http://localhost:5000/payments/createWithCustId`,
      {
        method: "POST",
        body: JSON.stringify({
          due: sub!.cost,
          status: Status.Started,
          custId: decodedToken!.id,
          dueDate: new Date(card!.expDate),
          period: sub!.period,
          paymentDate: new Date(),
        }),
        headers: { "Content-Type": "application/json" },
      }
    ).then((res) => res.json());
  };

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `http://localhost:5000/cards/findByCustomer/${email}`
      );
      if (res.status === 200) {
        const card: Card = await res.json();
        const result = {
          ...card,
          subName: card.subscription.name,
        };

        setValue({ value: result.id, label: result.subName });
        setCard(result);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `http://localhost:5000/customers/check/${decodedToken?.id}`
      );
      if (res.status === 200) {
        setCustomerVerification(false);
      } else setCustomerVerification(true);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res: Subscription[] = await fetch(
        `http://localhost:5000/subscriptions/`
      ).then((res) => res.json());
      setSubscriptions(res);

      const result = res.map((sub) => ({
        value: sub.id,
        label: sub.name + " " + sub.cost + " PLN/" + sub.period + " month(s)",
      }));
      setSubNames(result);
    })();
  }, []);

  const changeSubButton = () => {
    setOpen(true);
  };
  return (
    <PaperWithHeader headerText="Your card">
      {console.log(customerVerification)}
      {!customerVerification ? (
        <>
          {card ? (
            <Grid container spacing={3}>
              <Grid item xs={2} className={styles.header}>
                Due ammount
              </Grid>
              <Grid item xs={2} className={styles.header}>
                Expiration date
              </Grid>
              <Grid item xs={2} className={styles.header}>
                Active
              </Grid>
              <Grid item xs={4} className={styles.header}>
                Subscription
              </Grid>
              <Grid item xs={2} className={styles.header}></Grid>
              <Grid item xs={2}>
                {card.due + " PLN"}
              </Grid>
              <Grid item xs={2}>
                {DateTransformation(card.expDate)}
              </Grid>
              <Grid item xs={2}>
                <Checkbox checked={card.isActive}></Checkbox>
              </Grid>
              <Grid item xs={4}>
                {card.subName}
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={changeSubButton}
                >
                  Change your subscription
                </Button>
              </Grid>
              <ConfirmDialog
                open={open}
                setOpen={setOpen}
                title={
                  "Are you sure you want to change your subscription? This will incur a fee."
                }
                onConfirm={handleSubscriptionChange}
              >
                <FormControl style={{ width: `80%` }}>
                  <Select
                    style={{ width: `80%` }}
                    onChange={handleSelectionChange}
                  >
                    {subNames.map((sub) => (
                      <option key={sub.value} value={sub.value}>
                        {sub.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </ConfirmDialog>
            </Grid>
          ) : (
            <>
              <Typography>Choose the subscribtion!</Typography>
              <FormControl>
                <Select onChange={handleSelectionChange}>
                  {subNames.map((sub) => (
                    <option key={sub.value} value={sub.value}>
                      {sub.label}
                    </option>
                  ))}
                </Select>
                <Button onClick={handleCardCreation}>
                  Confirm subscription choice
                </Button>
              </FormControl>
            </>
          )}
        </>
      ) : (
        <Typography>
          To create your card, complete your profile info!
        </Typography>
      )}
    </PaperWithHeader>
  );
};

export default Card;
