import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import styles from "./FormFAB.module.scss";
import ChatIcon from "@material-ui/icons/Chat";
import FormSpreeContact from "./FormSpreeContact";

export default () => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={styles.fab}>
      {open && (
        <Dialog open={open} onClose={handleClose} className={styles.dialog}>
          <DialogTitle style={{ marginBottom: `0.2rem` }}>
            <Typography variant="h3">Contact us!</Typography>
          </DialogTitle>
          <DialogContent>
            <FormSpreeContact></FormSpreeContact>
          </DialogContent>
        </Dialog>
      )}
      <Fab color="primary" onClick={handleClick}>
        <ChatIcon
          className={styles.icon}
          style={{ color: "#FFFFFF" }}
        ></ChatIcon>
      </Fab>
    </div>
  );
};
