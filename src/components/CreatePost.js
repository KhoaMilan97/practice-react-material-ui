import React, { useState, useEffect, useContext } from "react";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import { useHistory } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputBase from "@material-ui/core/InputBase";
import InputLabel from "@material-ui/core/InputLabel";
import { withStyles, makeStyles, fade } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

import DispatContext from "../context/DispatchContext";
import StateContext from "../context/StateContext";

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

const CreatePost = (props) => {
  const history = useHistory();
  const classes = useStyles();
  const appDispatch = useContext(DispatContext);
  const appState = useContext(StateContext);
  const [loading, setLoading] = useState(false);

  const initialState = {
    title: {
      value: "",
      hasError: false,
      messages: "",
    },
    body: {
      value: "",
      hasError: false,
      messages: "",
    },
    submitCount: 0,
  };

  const ourReducer = (draft, action) => {
    switch (action.type) {
      case "titleImmediately":
        draft.title.value = action.value;
        draft.title.hasError = false;
        if (draft.title.value.trim() === "") {
          draft.title.hasError = true;
          draft.title.messages = "You must provide a title.";
        }
        return;
      case "bodyImmediately":
        draft.body.value = action.value;
        draft.body.hasError = false;
        if (draft.body.value.trim() === "") {
          draft.body.hasError = true;
          draft.body.messages = "You must provide post content.";
        }
        return;
      case "submitForm":
        if (!draft.title.hasError && !draft.body.hasError) {
          draft.submitCount++;
          console.log("hello");
        }
        return;
      default:
        break;
    }
  };

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "titleImmediately", value: state.title.value });
    dispatch({ type: "bodyImmediately", value: state.body.value });
    dispatch({ type: "submitForm" });
  };

  // Submit
  useEffect(
    () => {
      if (state.submitCount) {
        const ourRequest = Axios.CancelToken.source();
        let unmounted = false;

        setLoading(true);
        async function fetchResults() {
          try {
            const response = await Axios.post(
              "/create-post",
              {
                title: state.title.value,
                body: state.body.value,
                token: appState.user.token,
              },
              { cancelToken: ourRequest.token }
            );

            history.push(`/post/${response.data}`);

            if (!unmounted) {
              setLoading(false);
              appDispatch({
                type: "flashMessage",
                data: {
                  message: "Congrats, you created a new post.",
                  type: "success",
                },
              });
            }
          } catch (error) {
            if (!unmounted) {
              setLoading(false);
            }
            console.log("Something went wrong or cancel Token.");
          }
        }
        fetchResults();
        return () => {
          ourRequest.cancel();
          unmounted = true;
        };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.submitCount]
  );

  return (
    <Grid
      container
      alignItems="center"
      direction="column"
      style={{ marginTop: "5em", marginBottom: "5em" }}
    >
      <Grid item xs={10} sm={8} md={6} style={{ width: "100%" }}>
        <FormControl className={classes.margin}>
          <InputLabel shrink htmlFor="bootstrap-input">
            Title
          </InputLabel>
          <BootstrapInput
            fullWidth
            id="bootstrap-input"
            onChange={(e) => {
              dispatch({ type: "titleImmediately", value: e.target.value });
            }}
          />
          {state.title.hasError && (
            <div style={{ color: "red", fontSize: ".75rem", fontWeight: 300 }}>
              {state.title.messages}
            </div>
          )}
        </FormControl>
      </Grid>
      <Grid
        item
        xs={10}
        sm={8}
        md={6}
        style={{ width: "100%", marginTop: "1em" }}
      >
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
            onChange={(e) =>
              dispatch({ type: "bodyImmediately", value: e.target.value })
            }
          />
          {state.body.hasError && (
            <div style={{ color: "red", fontSize: ".75rem", fontWeight: 300 }}>
              {state.body.messages}
            </div>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={10} sm={8} md={6} style={{ width: "100%" }}>
        <Button
          onClick={handleSubmit}
          className={classes.button}
          variant="contained"
          color="primary"
          style={{ width: "14em" }}
        >
          Save new Post
          {loading && (
            <CircularProgress
              size={20}
              style={{ marginLeft: 5, color: "white" }}
            />
          )}
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreatePost;
