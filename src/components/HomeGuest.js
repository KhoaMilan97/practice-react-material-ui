import React, { useEffect, useContext, useState } from "react";
import { useImmerReducer } from "use-immer";
import Axios from "axios";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CircularProgress from "@material-ui/core/CircularProgress";

import DispatContext from "../context/DispatchContext";

const useStyles = makeStyles((theme) => ({
  rowContainer: {
    paddingTop: "10em",
    paddingBottom: "10em",
    paddingLeft: "5em",
    paddingRight: "5em",
    [theme.breakpoints.down("md")]: {
      paddingTop: "15em",
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: "5em",
    },
  },
  input: {
    paddingRight: "1em",
    fontSize: "1rem",
    [theme.breakpoints.down("sm")]: {
      paddingRight: 0,
    },
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  button: {
    paddingTop: "1em",
    paddingBottom: "1em",
    marginTop: "1em",
    backgroundColor: theme.palette.common.green,
    color: "white",
    fontSize: "1rem",
    "&:hover": {
      backgroundColor: theme.palette.secondary.light,
    },
  },
  formControl: {
    maxWidth: "20em",
    width: "100%",
    [theme.breakpoints.up("md")]: {
      maxWidth: "30em",
    },
  },
}));

const HomeGuest = () => {
  const classes = useStyles();
  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  const appDispatch = useContext(DispatContext);
  const [loading, setLoading] = useState(false);

  const initialState = {
    username: {
      value: "",
      hasErrors: false,
      messages: "",
      isUnique: false,
      checkCount: 0,
    },
    email: {
      value: "",
      hasErrors: false,
      messages: "",
      isUnique: false,
      checkCount: 0,
    },
    password: {
      value: "",
      hasErrors: false,
      messages: "",
    },
    submitCount: 0,
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "userImmediately":
        draft.username.value = action.value;
        draft.username.hasErrors = false;
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true;
          draft.username.messages = "Username cannot exceed 30 characters";
        }
        if (
          draft.username.value &&
          !/^([a-zA-Z0-9]+)$/.test(draft.username.value)
        ) {
          draft.username.hasErrors = true;
          draft.username.messages = "Username only contain letters and numbers";
        }
        return;
      case "usernameAfterDelay":
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true;
          draft.username.messages = "Username must be at least 3 characters.";
        }
        if (!draft.username.hasErrors && !action.noRequest) {
          draft.username.checkCount++;
        }
        return;
      case "usernameUniqueResults":
        if (action.value) {
          draft.username.hasErrors = true;
          draft.username.messages = "That username is already taken.";
        } else {
          draft.username.hasErrors = false;
          draft.username.messages = "";
        }
        return;
      case "emailImmediately":
        draft.email.value = action.value;
        draft.email.hasErrors = false;
        return;
      case "emailAfterDelay":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true;
          draft.email.messages = "You must provide a valid email.";
        }
        if (!draft.email.hasErrors && !action.noRequest) {
          draft.email.checkCount++;
        }
        return;
      case "emailUniqueResults":
        if (action.value) {
          draft.email.hasErrors = true;
          draft.email.messages = "That email is already used.";
        } else {
          draft.email.hasErrors = false;
          draft.email.messages = "";
        }
        return;
      case "passwordImmediately":
        draft.password.value = action.value;
        draft.password.hasErrors = false;
        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true;
          draft.password.messages = "Password cannot exceed 50 characters";
        }
        return;
      case "passwordAfterDelay":
        if (draft.password.value.length < 12) {
          draft.password.hasErrors = true;
          draft.password.messages = "Password must be at least 12 characters.";
        }
        return;
      case "submitForm":
        if (
          !draft.password.hasErrors &&
          !draft.username.hasErrors &&
          !draft.email.hasErrors
        ) {
          draft.submitCount++;
        }
        return;
      default:
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  // Username
  useEffect(
    () => {
      if (state.username.value) {
        const delay = setTimeout(() => {
          dispatch({ type: "usernameAfterDelay" });
        }, 500);
        return () => clearTimeout(delay);
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.username.value]
  );

  useEffect(
    () => {
      if (state.username.checkCount) {
        const ourRequest = Axios.CancelToken.source();
        async function fetchResults() {
          try {
            const response = await Axios.post(
              "/doesUsernameExist",
              { username: state.username.value },
              { cancelToken: ourRequest.token }
            );
            dispatch({ type: "usernameUniqueResults", value: response.data });
          } catch (error) {
            console.log("Something went wrong or cancel Token.");
          }
        }
        fetchResults();
        return () => ourRequest.cancel();
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.username.checkCount]
  );

  // email
  useEffect(
    () => {
      if (state.email.value) {
        const delay = setTimeout(() => {
          dispatch({ type: "emailAfterDelay" });
        }, 500);
        return () => clearTimeout(delay);
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.email.value]
  );

  useEffect(
    () => {
      if (state.email.checkCount) {
        const ourRequest = Axios.CancelToken.source();
        async function fetchResults() {
          try {
            const response = await Axios.post(
              "/doesEmailExist",
              { email: state.email.value },
              { cancelToken: ourRequest.token }
            );
            dispatch({ type: "emailUniqueResults", value: response.data });
          } catch (error) {
            console.log("Something went wrong or cancel Token.");
          }
        }
        fetchResults();
        return () => ourRequest.cancel();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.email.checkCount]
  );

  // Password
  useEffect(
    () => {
      if (state.password.value) {
        const delay = setTimeout(() => {
          dispatch({ type: "passwordAfterDelay" });
        }, 500);
        return () => clearTimeout(delay);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.password.value]
  );

  // Submit
  useEffect(
    () => {
      if (state.submitCount) {
        const ourRequest = Axios.CancelToken.source();
        setLoading(true);
        async function fetchResults() {
          try {
            const response = await Axios.post(
              "/register",
              {
                username: state.username.value,
                email: state.email.value,
                password: state.password.value,
              },
              { cancelToken: ourRequest.token }
            );

            appDispatch({ type: "login", payload: response.data });
            appDispatch({
              type: "flashMessage",
              data: {
                message: "Congrats! Welcome to your new account.",
                type: "success",
              },
            });
            setLoading(false);
          } catch (error) {
            console.log("Something went wrong or cancel Token.");
            setLoading(false);
          }
        }
        fetchResults();
        return () => ourRequest.cancel();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.submitCount]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({ type: "userImmediately", value: state.username.value });
    dispatch({ type: "usernameAfterDelay", noRequest: true });
    dispatch({ type: "emailImmediately", value: state.email.value });
    dispatch({ type: "emailAfterDelay", noRequest: true });
    dispatch({ type: "passwordImmediately", value: state.password.value });
    dispatch({ type: "passwordAfterDelay" });
    dispatch({ type: "submitForm" });
  };

  return (
    <Grid
      container
      direction={matchesXS ? "column" : "row"}
      alignItems="center"
      className={classes.rowContainer}
      spacing={matchesXS ? 0 : 2}
      style={{ width: "100%" }}
    >
      <Grid item sm={7}>
        <Grid container style={{ maxWidth: "40em" }} direction="column">
          <Grid item>
            <Typography variant="h2" align={matchesXS ? "center" : "inherit"}>
              Remember Writing?
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="body1"
              align={matchesXS ? "center" : "inherit"}
              paragraph
            >
              Are you sick of short tweets and impersonal “shared” posts that
              are reminiscent of the late 90’s email forwards? We believe
              getting back to actually writing is the key to enjoying the
              internet again.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sm={5}>
        <form onSubmit={handleSubmit}>
          <Grid
            alignItems="center"
            container
            direction="column"
            className={classes.form}
          >
            <Grid item className={classes.formControl}>
              <TextField
                variant="outlined"
                margin="normal"
                onChange={(e) =>
                  dispatch({ type: "userImmediately", value: e.target.value })
                }
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="off"
                helperText={state.username.hasErrors && state.username.messages}
                error={state.username.hasErrors}
              />
            </Grid>
            <Grid item className={classes.formControl}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="email"
                onChange={(e) =>
                  dispatch({ type: "emailImmediately", value: e.target.value })
                }
                label="Email"
                name="email"
                autoComplete="off"
                helperText={state.email.hasErrors && state.email.messages}
                error={state.email.hasErrors}
              />
            </Grid>
            <Grid item className={classes.formControl}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                onChange={(e) =>
                  dispatch({
                    type: "passwordImmediately",
                    value: e.target.value,
                  })
                }
                type="password"
                id="password"
                label="Password"
                name="password"
                autoComplete="off"
                helperText={state.password.hasErrors && state.password.messages}
                error={state.password.hasErrors}
              />
            </Grid>
            <Grid item className={classes.formControl}>
              <Button
                variant="contained"
                fullWidth
                type="submit"
                className={classes.button}
                onClick={handleSubmit}
              >
                Sign up for Complex App {loading && <CircularProgress />}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default HomeGuest;
