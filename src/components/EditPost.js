import React, { useState, useEffect, useContext } from "react";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";

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

import ErrorMessage from "./util/ErrorMessage";

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
  backLink: {
    textDecoration: "none",
    color: theme.palette.common.blue,
    fontWeight: 700,
    marginBottom: 20,
    marginLeft: 8,
    display: "inline-block",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const EditPost = (props) => {
  const classes = useStyles();
  const appDispatch = useContext(DispatContext);
  const appState = useContext(StateContext);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

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
      case "fetchComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        return;
      case "submitForm":
        if (!draft.title.hasError && !draft.body.hasError) {
          draft.submitCount++;
        }
        return;
      default:
        break;
    }
  };

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchResults() {
      try {
        const response = await Axios.get(
          `/post/${id}`,

          { cancelToken: ourRequest.token }
        );
        dispatch({ type: "fetchComplete", value: response.data });
      } catch (error) {
        console.log("Something went wrong or cancel Token.");
      }
    }
    fetchResults();
    return () => {
      ourRequest.cancel();
    };
  }, [id, dispatch]);

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
            await Axios.post(
              `/post/${id}/edit`,
              {
                title: state.title.value,
                body: state.body.value,
                token: appState.user.token,
              },
              { cancelToken: ourRequest.token }
            );

            appDispatch({
              type: "flashMessage",
              data: {
                message: "Post was updated",
                type: "success",
              },
            });
            if (!unmounted) {
              setLoading(false);
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
        <Link className={classes.backLink} to={`/post/${id}`}>
          &laquo; Back to post permalink
        </Link>
        <FormControl className={classes.margin}>
          <InputLabel shrink htmlFor="bootstrap-input">
            Title
          </InputLabel>
          <BootstrapInput
            fullWidth
            id="bootstrap-input"
            value={state.title.value}
            onChange={(e) => {
              dispatch({ type: "titleImmediately", value: e.target.value });
            }}
          />
          {state.title.hasError && (
            <ErrorMessage message={state.title.messages} />
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
            value={state.body.value}
            id="bootstrap-input"
            onChange={(e) =>
              dispatch({ type: "bodyImmediately", value: e.target.value })
            }
          />
          {state.body.hasError && (
            <ErrorMessage message={state.body.messages} />
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
          Save Post
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

export default EditPost;
