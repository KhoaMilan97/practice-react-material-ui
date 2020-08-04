import React, { useEffect, useContext, useState } from "react";
import Axios from "axios";

import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import List from "@material-ui/core/List";
import StateContext from "../context/StateContext";
import { makeStyles } from "@material-ui/core/styles";

import Post from "./Post";
import LoadingDotsIcon from "./util/LoadingDotsIcon";

const useStyles = makeStyles((theme) => ({
  listGroup: {
    width: "100%",
  },
}));

const Home = () => {
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const appState = useContext(StateContext);
  const classes = useStyles();

  useEffect(
    () => {
      const ourRequest = Axios.CancelToken.source();
      const token = appState.user.token;
      let unmounted = false;
      setLoading(true);
      async function fetchPost() {
        try {
          const response = await Axios.post(
            "/getHomeFeed",
            { token: token },
            { cancelToken: ourRequest.token }
          );
          if (!unmounted) {
            setPost(response.data);
            setLoading(false);
          }
        } catch (err) {
          if (!unmounted) {
            setLoading(false);
          }
          console.log("Something went wrong or cancel Token");
        }
      }
      fetchPost();
      return () => {
        ourRequest.cancel();
        unmounted = true;
      };
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (loading) {
    return <LoadingDotsIcon />;
  }

  return (
    <Grid
      container
      direction="column"
      style={{ marginTop: "5em", marginBottom: "5em" }}
      alignItems="center"
    >
      <Grid item>
        <Typography variant="h4" align="center">
          The Latest From Those You Follow
        </Typography>
      </Grid>
      <Grid item container md={6} style={{ marginTop: "2em" }}>
        {post.length > 0 && (
          <List className={classes.listGroup}>
            {post.map((item) => {
              return <Post key={item._id} post={item} />;
            })}
          </List>
        )}
        {post.length === 0 && (
          <Typography variant="body1" align="center">
            Your feed displays the latest posts from the people you follow. If
            you don&rsquo;t have any friends to follow that&rsquo;s okay; you
            can use the &ldquo;Search&rdquo; feature in the top menu bar to find
            content written by people with similar interests and then follow
            them.
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Home;
