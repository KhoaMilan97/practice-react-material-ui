import React, { useState, useContext } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import HeaderLogIn from "./HeaderLogIn";
import DispatchContext from "../../context/DispatchContext";
import StateContext from "../../context/StateContext";

Axios.defaults.baseURL = "https://backendapisocialnetwork.herokuapp.com";

const useStyles = makeStyles((theme) => ({
  toolbarMargin: {
    ...theme.mixins.toolbar,
    [theme.breakpoints.down("md")]: {
      marginTop: "5em",
    },
  },
  input: {
    paddingRight: "1em",
    fontSize: "1rem",

    [theme.breakpoints.down("sm")]: {
      paddingRight: 0,
    },
  },
  textFiled: {
    "& .MuiInputBase-root": {
      color: "white",
      backgroundColor: "#444",
    },
    "& .MuiFormLabel-root": {
      color: "white",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#444",
      },
      "&:hover fieldset": {
        borderColor: "#444",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
        borderWidth: 1,
      },
    },
  },
  avatar: {
    width: 32,
    height: 32,
    verticalAlign: "center",
  },
  logout: {
    textTransform: "capitalize",
    backgroundColor: theme.palette.common.gray,
    "&:hover": {
      backgroundColor: theme.palette.common.gray,
      opacity: 0.9,
    },
  },
  icon: {
    padding: 8,
  },
  headerButton: {
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: theme.palette.secondary.light,
    },
  },
  link: {
    textDecoration: "none",
    backgroundColor: "transparent",
    color: "white",
    fontSize: "1.5rem",
    fontWeight: "400",
  },
}));

const Header = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useContext(DispatchContext);
  const state = useContext(StateContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await Axios.post("/login", { username, password });
      if (response.data) {
        dispatch({ type: "login", payload: response.data });
        dispatch({
          type: "flashMessage",
          data: {
            message: "You have successfully logged in.",
            type: "success",
          },
        });
      } else {
        dispatch({
          type: "flashMessage",
          data: {
            message: "Invalid Username / Password.",
            type: "error",
          },
        });
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
    setUsername("");
    setPassword("");
  };

  const HeaderLogOut = (
    <form onSubmit={handleLogin}>
      <Grid
        container
        direction={matchesSM ? "column" : "row"}
        alignItems={matchesSM ? "center" : undefined}
      >
        <Grid item style={{ marginBottom: matchesSM ? "1em" : 0 }}>
          <TextField
            label="Username"
            variant="outlined"
            className={classes.input}
            value={username}
            size="small"
            classes={{ root: classes.textFiled }}
            fullWidth
            onChange={(e) => setUsername(e.target.value)}
          />
        </Grid>
        <Grid item style={{ marginBottom: matchesSM ? "1em" : 0 }}>
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            className={classes.input}
            value={password}
            size="small"
            classes={{ root: classes.textFiled }}
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <Grid
          item
          style={{
            alignSelf: "center",
            marginBottom: matchesSM ? "1em" : 0,
          }}
        >
          <Button
            onClick={handleLogin}
            variant="contained"
            type="submit"
            color="secondary"
            style={{ width: 90 }}
          >
            {loading ? (
              <CircularProgress size={30} style={{ color: "white" }} />
            ) : (
              "Sign in"
            )}
          </Button>
        </Grid>
      </Grid>
    </form>
  );

  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <Grid
            container
            direction={matchesSM ? "column" : "row"}
            justify="space-between"
          >
            <Grid
              item
              style={{
                alignSelf: "center",
                marginBottom: matchesSM ? "1em" : 0,
                marginTop: matchesSM ? "2em" : 0,
              }}
            >
              <Typography component={Link} to="/" className={classes.link}>
                Complex App
              </Typography>
            </Grid>
            <Grid item>
              {state.loggedIn ? (
                <HeaderLogIn classes={classes} matchesSM={matchesSM} />
              ) : (
                HeaderLogOut
              )}
              {/* {HeaderLogOut} */}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default Header;
