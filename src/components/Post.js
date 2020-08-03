import React from "react";

import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import { Typography } from "@material-ui/core";

const Post = (props) => {
  const { post, classes } = props;

  const date = new Date(post.createdDate);
  const formatDate = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;
  return (
    <ListItem className={classes.listGroupItem}>
      <Avatar
        src={post.author.avatar}
        alt="Avatar profile"
        style={{ width: 24, height: 24, verticalAlign: "center" }}
      />

      <Typography style={{ marginLeft: 5 }} variant="body2">
        <strong style={{ color: "#000" }}>{post.title}</strong>
      </Typography>
      <Typography style={{ marginLeft: 5 }} variant="body2">
        by {post.author.username} on {formatDate}
      </Typography>
    </ListItem>
  );
};

export default Post;
