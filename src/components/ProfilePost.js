import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";

import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LoadingDotsIcon from "./util/LoadingDotsIcon";

const useStyles = makeStyles((theme) => ({
  listGroupItem: {
    border: "1px solid rgba(0,0,0,.125)",
    padding: ".75rem 1.25rem",
    marginBottom: "-1px",
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
}));

const ProfilePost = () => {
  const classes = useStyles();
  const [post, setPost] = useState([]);
  const { username } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    setLoading(true);
    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, {
          cancelToken: ourRequest.token,
        });
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        console.log("Something went wrong or cancel Token");
        setLoading(false);
      }
    }
    fetchPosts();
    return () => {
      ourRequest.cancel();
    };
  }, [username]);

  if (loading) {
    return <LoadingDotsIcon />;
  }

  return (
    <React.Fragment>
      {post.map((post) => {
        const date = new Date(post.createdDate);
        const formatDate = `${
          date.getMonth() + 1
        }/${date.getDate()}/${date.getFullYear()}`;
        return (
          <ListItem
            key={post._id}
            className={classes.listGroupItem}
            component={Link}
            to={`/post/${post._id}`}
          >
            <Avatar
              src={post.author && post.author.avatar}
              alt="Avatar profile"
              style={{ width: 24, height: 24, verticalAlign: "center" }}
            />

            <Typography style={{ marginLeft: 5 }} variant="body2">
              <strong style={{ color: "#000" }}>{post.title}</strong>
            </Typography>
            <Typography style={{ marginLeft: 5 }} variant="body2">
              on {formatDate}
            </Typography>
          </ListItem>
        );
      })}
    </React.Fragment>
  );
};

export default ProfilePost;
