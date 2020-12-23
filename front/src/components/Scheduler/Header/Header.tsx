import { AppointmentTooltip } from "@devexpress/dx-react-scheduler-material-ui";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  StylesProvider,
  Typography,
} from "@material-ui/core";
import { AssignmentTurnedIn } from "@material-ui/icons";
import { IconButton } from "material-ui";
import React, { useState } from "react";
import styles from "./Header.module.scss";

type HeaderProps = AppointmentTooltip.HeaderProps;

const Header = ({ appointmentData, ...props }: HeaderProps) => {
  const [open, setOpen] = useState(false);

  const handleDialogOpen = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);

  const handleSignIn = () => {
    // implement

    handleDialogClose();
  };

  return (
    <>
      <AppointmentTooltip.Header appointmentData={appointmentData} {...props}>
        <IconButton onClick={handleDialogOpen} className={styles.button}>
          <AssignmentTurnedIn />
        </IconButton>
      </AppointmentTooltip.Header>
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>
          <Typography variant="h5">Sign in for a training</Typography>
        </DialogTitle>
        <DialogContent dividers>
          Appointment data: {JSON.stringify(appointmentData) + "\n"}
          TODO:: Może jakieś inne dane, ilość miejsc wolnych, przypomnienie jaki
          jest trener, pokój, data
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleDialogClose}>
            Close
          </Button>
          <Button color="primary" onClick={handleSignIn}>
            Sign in
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
