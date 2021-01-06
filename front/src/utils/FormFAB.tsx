import { Button, Fab } from "@material-ui/core";
import React, { useState } from "react";
import styles from "./FormFAB.module.scss";

export default () => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.fab}>
      <Fab>Dupa</Fab>
    </div>
  );
};
