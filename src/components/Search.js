import React, { useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import Axios from "axios";

import Grid from "@material-ui/core/Grid";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import CancelIcon from "@material-ui/icons/Cancel";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { List, ListItem, Typography, IconButton } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

import DispatchContext from "../context/DispatchContext";
import Post from "./Post";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  search: {
    width: "100%",
    height: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 999,
    backgroundColor: "rgba(215, 215, 215, 0.911)",
  },
  searchInput: {
    backgroundColor: "#fff",
    paddingTop: "1em",
    paddingBottom: "1em",
    width: "100%",
  },
  icon: {
    fontSize: "3rem",
    [theme.breakpoints.down("xs")]: {
      fontSize: "2rem",
    },
  },
  listGroupItem: {
    border: "1px solid rgba(0,0,0,.125)",
    padding: ".75rem 1.25rem",
    marginBottom: "-1px",
    backgroundColor: "white",
    "&:first-child": {
      borderTopLeftRadius: ".25rem",
      borderTopRightRadius: ".25rem",
    },
    "&:last-child": {
      bordeBottomRightRadius: ".25rem",
      borderBottomLeftRadius: ".25rem",
    },
    "&:hover": {
      backgroundColor: "#eee",
    },
  },
  progress: {
    margin: "0 auto",
  },
}));

const Search = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const appDispatch = useContext(DispatchContext);
  const [search, setSearch] = useImmer({
    value: "",
    searchResult: [],
    show: "neither",
    requestCount: 0,
  });

  useEffect(() => {
    function searchKeyPressHandler(e) {
      if (e.keyCode === 27) {
        appDispatch({ type: "closeSearch" });
      }
    }

    document.addEventListener("keyup", searchKeyPressHandler);
    return () => {
      document.removeEventListener("keyup", searchKeyPressHandler);
    };
  }, [appDispatch]);

  useEffect(() => {
    if (search.value.trim()) {
      setSearch((draft) => {
        draft.show = "loading";
      });
      const delay = setTimeout(() => {
        setSearch((draft) => {
          draft.requestCount++;
        });
      }, 700);
      return () => {
        clearTimeout(delay);
      };
    } else {
      setSearch((draft) => {
        draft.show = "neither";
      });
    }
  }, [search.value]);

  useEffect(() => {
    if (search.requestCount) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchSearch() {
        try {
          const response = await Axios.post(
            "/search",
            { searchTerm: search.value },
            { cancelToken: ourRequest.token }
          );
          setSearch((draft) => {
            draft.searchResult = response.data;
            draft.show = "result";
          });
        } catch (e) {
          console.log("Something went wrong or cancel Token");
        }
      }
      fetchSearch();
      return () => ourRequest.cancel();
    }
  }, [search.requestCount]);

  function handleChange(e) {
    const value = e.target.value;
    setSearch((draft) => {
      draft.value = value;
    });
  }

  return (
    <div className={classes.search}>
      <Grid container direction="column" alignItems="center" justify="center">
        <Grid item className={classes.searchInput}>
          <Grid container item xs={10} sm={6} style={{ margin: "0 auto" }}>
            <Grid item xs={1}>
              <SearchIcon color="primary" className={classes.icon} />
            </Grid>
            <Grid item xs={10}>
              <TextField
                autoFocus
                fullWidth
                label="What are you interested in?"
                autoComplete="off"
                value={search.value}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={() => appDispatch({ type: "closeSearch" })}>
                <CancelIcon
                  style={{ color: theme.palette.common.gray }}
                  className={classes.icon}
                />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container xs={10} sm={6} direction="column">
          <List className={classes.listGroup}>
            {search.show === "loading" && (
              <CircularProgress className={classes.progress} color="primary" />
            )}
            {Boolean(search.searchResult.length) && search.show === "result" && (
              <>
                <ListItem
                  className={classes.listGroupItem}
                  style={{
                    backgroundColor: theme.palette.common.blue,
                    color: "white",
                  }}
                >
                  <Typography variant="h2">
                    Search Result (2 items found)
                  </Typography>
                </ListItem>
                {search.searchResult.map((search) => {
                  return <Post key={search._id} post={search} />;
                })}
              </>
            )}
            {!Boolean(search.searchResult.length) &&
              search.show === "result" && (
                <Alert severity="error">
                  Sorry, we could not find any results for that search.
                </Alert>
              )}
          </List>
        </Grid>
      </Grid>
    </div>
  );
};

export default Search;
