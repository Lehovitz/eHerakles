import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar } from "material-ui";
import { IconButton } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Menu } from "@material-ui/icons";

const AppBarComponent = () => {
  return (
    <AppBar position="static" color="default">
      <Toolbar style={{ background: "#212121" }}>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <Menu />
        </IconButton>
        <Typography variant="h6">News</Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
