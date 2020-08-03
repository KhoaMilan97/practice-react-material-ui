import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputBase from "@material-ui/core/InputBase";
import InputLabel from "@material-ui/core/InputLabel";
import { withStyles, makeStyles, fade } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.common.white,
    border: "1px solid #ced4da",
    fontSize: 16,
    width: "100%",
    padding: "10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    margin: theme.spacing(1),
    width: "100%",
  },
  button: {
    marginLeft: 8,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
}));

const CreatePost = () => {
  const classes = useStyles();
  const [title, setTitle] = useState();
  const [content, setContent] = useState();

  const handleSubmit = (e) => {
    console.log(title, content);
  };

  return (
    <Grid
      container
      alignItems="center"
      direction="column"
      style={{ marginTop: "5em", marginBottom: "5em" }}
    >
      <Grid item md={6} style={{ width: "100%" }}>
        <FormControl className={classes.margin}>
          <InputLabel shrink htmlFor="bootstrap-input">
            Title
          </InputLabel>
          <BootstrapInput
            component={TextField}
            fullWidth
            id="bootstrap-input"
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
      </Grid>
      <Grid item md={6} style={{ width: "100%", marginTop: "1em" }}>
        <FormControl className={classes.margin}>
          <InputLabel shrink htmlFor="bootstrap-input">
            Body Content
          </InputLabel>
          <BootstrapInput
            component={TextField}
            multiline
            rows={15}
            fullWidth
            id="bootstrap-input"
            onChange={(e) => setContent(e.target.value)}
          />
        </FormControl>
      </Grid>
      <Grid item md={6} style={{ width: "100%" }}>
        <Button
          onClick={handleSubmit}
          className={classes.button}
          variant="contained"
          color="primary"
        >
          Save new Post
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreatePost;
