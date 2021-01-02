import {
  Avatar,
  Button,
  createStyles,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  Theme,
  Typography,
  Select,
} from "@material-ui/core";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DecodedToken from "../../models/DecodedToken";
import { RootState } from "../../redux";
import PaperWithHeader from "../Shared/PaperWithHeader/PaperWithHeader";
import Dialog from "@material-ui/core/Dialog";
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from "@material-ui/icons/Add";
import ConfirmDialog from "./ConfirmDialog";
import { NumberLiteralType } from "typescript";

type Subscription = {
  id: number;
  period: number;
  name: string;
  cost: number;
};

type Customer = {
  id: number;
  email: string;
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
      const res: Card = await fetch(
        `http://localhost:5000/cards/findByCustomer/${email}`
      ).then((res) => res.json());

      const result = {
        ...res,
        subName: res.subscription.name,
      };

      setValue({ value: result.id, label: result.subName });
      setCard(result);
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
    <PaperWithHeader headerText="All payments">
      {card ? (
        <Grid key={card.id} container spacing={3}>
          <Grid item xs={2}>
            {card.id}
          </Grid>
          <Grid item xs={2}>
            {card.due}
          </Grid>
          <Grid item xs={2}>
            {card.expDate}
          </Grid>
          <Grid item xs={2}>
            {card.isActive}
          </Grid>
          <Grid item xs={2}>
            {card.subName}
          </Grid>
          <Grid item xs={2}>
            <Button onClick={changeSubButton}>Change your subscription</Button>
          </Grid>
          <ConfirmDialog
            open={open}
            setOpen={setOpen}
            title={
              "Are you sure you want to change your subscription? This will incur a fee."
            }
            onConfirm={handleSubscriptionChange}
          >
            <FormControl>
              <Select onChange={handleSelectionChange}>
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
          <Typography>Choose subscribtion!</Typography>
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
    </PaperWithHeader>
  );
};

export default Card;
