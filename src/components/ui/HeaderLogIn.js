import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";

import DispatchContext from "../../context/DispatchContext";
import StateContext from "../../context/StateContext";

const HeaderLogIn = (props) => {
  const { classes, matchesSM } = props;
  const dispatch = useContext(DispatchContext);
  const state = useContext(StateContext);
  const history = useHistory();

  return (
    <Grid
      container
      spacing={1}
      justify="center"
      style={{ marginBottom: matchesSM ? 10 : 0 }}
    >
      <Grid item>
        <IconButton className={classes.icon}>
          <SearchIcon style={{ color: "white", fontSize: 20 }} />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton className={classes.icon}>
          <ChatBubbleIcon style={{ color: "white", fontSize: 20 }} />
        </IconButton>
      </Grid>
      <Grid item style={{ alignSelf: "center" }}>
        <Avatar
          alt="Remy Sharp"
          src={state.user.avatar}
          className={classes.avatar}
        />
      </Grid>
      <Grid item style={{ alignSelf: "center" }}>
        <Button
          className={classes.headerButton}
          variant="contained"
          color="secondary"
          component={Link}
          to="/create"
          disableElevation
        >
          Create Post
        </Button>
      </Grid>
      <Grid item style={{ alignSelf: "center" }}>
        <Button
          variant="contained"
          color="secondary"
          className={classes.logout}
          disableElevation
          onClick={() => {
            dispatch({ type: "logout" });
            dispatch({
              type: "flashMessage",
              data: {
                message: "You have successfully logged out.",
                type: "success",
              },
            });
            history.push("/");
          }}
        >
          Sign Out
        </Button>
      </Grid>
    </Grid>
  );
};

export default HeaderLogIn;
