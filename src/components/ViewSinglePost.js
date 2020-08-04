import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";

import { Grid, Typography, IconButton, Avatar } from "@material-ui/core";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import LoadingDotsIcon from "./util/LoadingDotsIcon";

// "/post/:id"

const ViewSinglePost = () => {
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

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

  const date = new Date(post.createdDate);
  const formatDate = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  if (loading) {
    return <LoadingDotsIcon />;
  }

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
        <Grid item>
          <IconButton component={Link} to={`/post/${post._id}/edit`}>
            <EditIcon color="primary" />
          </IconButton>
          <IconButton>
            <DeleteIcon style={{ color: "#dc3545" }} />
          </IconButton>
        </Grid>
      </Grid>
      <Grid item container md={6}>
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
