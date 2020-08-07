import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import Axios from "axios";

import { Grid, Typography, IconButton, Avatar } from "@material-ui/core";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import LoadingDotsIcon from "./util/LoadingDotsIcon";

import StateContext from "../context/StateContext";
import DispatchContext from "../context/DispatchContext";
import NotFound from "./NotFound";

// "/post/:id"

const ViewSinglePost = () => {
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const history = useHistory();

  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    let unmounted = false;
    setLoading(true);
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, {
          cancelToken: ourRequest.token,
        });
        if (!unmounted) {
          setPost(response.data);
          setLoading(false);
        }
      } catch (err) {
        console.log("Something went wrong or cancel Token");

        if (!unmounted) {
          setLoading(false);
        }
      }
    }

    fetchPost();
    return () => {
      ourRequest.cancel();
      unmounted = true;
    };
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Do you really want to delete this post")) {
      try {
        const response = await Axios.delete(`/post/${id}`, {
          data: { token: appState.user.token },
        });

        if (response.data) {
          appDispatch({
            type: "flashMessage",
            data: {
              message: "Post was successfully deleted.",
              type: "success",
            },
          });
          history.push(`/profile/${appState.user.username}`);
        }
      } catch (error) {
        console.log("Something went wrong");
      }
    }
  };

  const date = new Date(post.createdDate);
  const formatDate = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  if (!post && !loading) {
    return <NotFound />;
  }

  if (loading) {
    return <LoadingDotsIcon />;
  }

  const isOwner = () => {
    if (appState.loggedIn) {
      if (appState.user.username === (post.author && post.author.username)) {
        return true;
      }
    }
    return false;
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      style={{ marginBottom: "5em", marginTop: "5em" }}
    >
      <Grid item container justify="space-between" direction="row" md={6}>
        <Grid item>
          <Typography variant="h2">{post.title}</Typography>
        </Grid>
        {isOwner() ? (
          <Grid item>
            <IconButton component={Link} to={`/post/${post._id}/edit`}>
              <EditIcon color="primary" />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon style={{ color: "#dc3545" }} />
            </IconButton>
          </Grid>
        ) : null}
      </Grid>
      <Grid item container md={6} style={{ marginTop: 10 }}>
        <Avatar
          src={post.author && post.author.avatar}
          alt="Avatar profile"
          style={{ width: 24, height: 24, verticalAlign: "center" }}
          component={Link}
          to={`/profile/${post.author && post.author.username}`}
        />

        <Typography style={{ marginLeft: 5 }} variant="body2">
          Posted by{" "}
          <Link
            style={{ textDecoration: "none", color: "#007bff" }}
            to={`/profile/${post.author && post.author.username}`}
          >
            {post.author && post.author.username}
          </Link>{" "}
          on {formatDate}
        </Typography>
      </Grid>
      <Grid item container md={6} style={{ marginTop: "2em" }}>
        {post.body}
      </Grid>
    </Grid>
  );
};

export default ViewSinglePost;
