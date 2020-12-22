import { Paper, Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import styles from "./PaperWithHeader.module.scss";

interface PaperWithHeaderProps {
  headerText: string;
  children: React.ReactNode;
}

const PaperWithHeader = ({ headerText, children }: PaperWithHeaderProps) => {
  return (
    <div className={styles.container}>
      <Typography variant="h3">{headerText}</Typography>
      <Paper className={styles.content} elevation={3}>
        {children}
      </Paper>
    </div>
  );
};

export default PaperWithHeader;
