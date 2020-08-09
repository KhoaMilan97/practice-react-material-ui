import React, { useContext } from "react";
import { Link } from "react-router-dom";

import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import DisptachContext from "../context/DispatchContext";

const useStyles = makeStyles((theme) => ({
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
}));

const Post = (props) => {
  const { post } = props;
  const classes = useStyles();
  const appDispatch = useContext(DisptachContext);

  const date = new Date(post.createdDate);
  const formatDate = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;
  return (
    <ListItem
      component={Link}
      to={`/post/${post._id}`}
      className={classes.listGroupItem}
      onClick={() => appDispatch({ type: "closeSearch" })}
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
        by {post.author && post.author.username} on {formatDate}
      </Typography>
    </ListItem>
  );
};

export default Post;
