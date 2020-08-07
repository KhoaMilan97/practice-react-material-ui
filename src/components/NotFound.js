import React from "react";
import { Link } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const NotFound = () => {
  return (
    <Grid
      container
      direction="column"
      style={{ marginTop: "5em", marginBottom: "5em" }}
    >
      <Grid item>
        <Typography variant="h2" align="center">
          Whoops, we cannot find that page.
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1" align="center">
          You can always visit the{" "}
          <Link to="/" style={{ textDecoration: "none" }}>
            homepage
          </Link>{" "}
          to get a fresh start.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default NotFound;
