import React from "react";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.common.blue,
    textDecoration: "none",
    backgroundColor: "transparent",
    textTransform: "capitalize",
    fontWeight: "normal",
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <Grid container direction="column">
      <Divider light />
      <Grid item xs style={{ marginTop: "1em" }}>
        <Grid container justify="center">
          <Grid item>
            <Button variant="text" className={classes.link}>
              Home
            </Button>
            <span color="primary">|</span>
          </Grid>
          <Grid item>
            <Button variant="text" className={classes.link}>
              About Us
            </Button>
            <span color="primary">|</span>
          </Grid>
          <Grid item>
            <Button variant="text" className={classes.link}>
              Terms
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs style={{ marginTop: "1em", marginBottom: "1em" }}>
        <Typography variant="body1" align="center">
          Copyright © 2020 ComplexApp. All rights reserved.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Footer;
