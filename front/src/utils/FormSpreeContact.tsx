// Customize this 'myform.js' script and add it to your JS bundle.
// Then import it with 'import MyForm from "./myform.js"'.
// Finally, add a <MyForm/> element whereever you wish to display the form.

import {
  Button,
  DialogActions,
  InputLabel,
  TextareaAutosize,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import styles from "./FormFAB.module.scss";

export default () => {
  const [status, setStatus] = useState("");

  const submitForm = (ev: any) => {
    ev.preventDefault();
    const form = ev.target;
    const data = new FormData(form);
    const xhr = new XMLHttpRequest();
    xhr.open(form.method, form.action);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      if (xhr.status === 200) {
        form.reset();
        setStatus("SUCCESS");
      } else {
        setStatus("ERROR");
      }
    };
    xhr.send(data);
  };

  return (
    <form
      style={{ width: `100%`, height: `100%` }}
      onSubmit={submitForm}
      action="https://formspree.io/f/mdoppqvr"
      method="POST"
    >
      <InputLabel>Email:</InputLabel>
      <TextField type="email" name="email" className={styles.mail} />
      <InputLabel>Message:</InputLabel>
      <TextareaAutosize
        rowsMin="20"
        name="message"
        style={{ width: `30rem` }}
      />
      <div className={styles.buttonContainer}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={styles.button}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};
