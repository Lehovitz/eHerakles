import { Button, Dialog, DialogContent, Fab } from "@material-ui/core";
import React, { useState } from "react";
import styles from "./FormFAB.module.scss";
import ChatIcon from "@material-ui/icons/Chat";
import FormSpreeContact from "./FormSpreeContact";

export default () => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    console.log("XDD");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={styles.fab}>
      {open && (
        <Dialog open={open} onClose={handleClose} className={styles.dialog}>
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
