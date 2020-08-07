import React, { useState, useEffect, useContext } from "react";
import { Switch, Route, Link, useParams } from "react-router-dom";
import Axios from "axios";
import { useImmer } from "use-immer";

import Grid from "@material-ui/core/Grid";
import { Avatar, Typography } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import FollowersProfile from "./FollowersProfile";
import FollowingProfile from "./FollowingProfile";
import ProfilePost from "./ProfilePost";
import StateContext from "../context/StateContext";
import NotFound from "./NotFound";

const Profile = () => {
  const [value, setValue] = useState(0);
  const { username } = useParams();
  const appState = useContext(StateContext);

  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
      isFollowing: false,
      counts: { postCount: "", followerCount: "", followingCount: "" },
    },
  });

  const handleChange = (e, value) => {
    setValue(value);
  };

  // Fixed tab when refresh
  useEffect(() => {
    if (window.location.pathname === `/profile/${username}` && value !== 0) {
      setValue(0);
    } else if (
      window.location.pathname === `/profile/${username}/followers` &&
      value !== 1
    ) {
      setValue(1);
    } else if (
      window.location.pathname === `/profile/${username}/following` &&
      value !== 2
    ) {
      setValue(2);
    }
  }, [value, username]);

  useEffect(
    () => {
      const ourRequest = Axios.CancelToken.source();
      async function fetchProfile() {
        try {
          const response = await Axios.post(
            `/profile/${username}`,
            { token: appState.user.token },
            { cancelToken: ourRequest.token }
          );

          setState((draft) => {
            draft.profileData = response.data;
          });
        } catch (err) {
          console.log("Something went wrong or cancel Token");
        }
      }
      fetchProfile();
      return () => {
        ourRequest.cancel();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [username]
  );

  if (!state.profileData) {
    return <NotFound />;
  }

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      style={{ marginTop: "5em", marginBottom: "5em" }}
    >
      <Grid item container md={6} alignItems="center">
        <Grid item>
          <Avatar
            src={state.profileData.profileAvatar}
            style={{ width: 32, height: 32 }}
          />
        </Grid>
        <Grid item>
          <Typography style={{ marginLeft: 10 }} variant="h2">
            {state.profileData.profileUsername}
          </Typography>
        </Grid>
      </Grid>
      <Grid item container md={6}>
        <Tabs value={value} onChange={handleChange}>
          <Tab
            label="Post"
            component={Link}
            to={`/profile/${state.profileData.profileUsername}`}
            selected={value}
          />
          <Tab
            label="Followers"
            component={Link}
            to={`/profile/${state.profileData.profileUsername}/followers`}
            selected={value}
          />
          <Tab
            label="Following"
            component={Link}
            to={`/profile/${state.profileData.profileUsername}/following`}
            selected={value}
          />
        </Tabs>
      </Grid>
      <Grid item container md={6} style={{ marginTop: 20 }}>
        <Switch>
          <Route exact path="/profile/:username">
            <ProfilePost />
          </Route>
          <Route path="/profile/:username/followers">
            <FollowersProfile />
          </Route>
          <Route path="/profile/:username/following">
            <FollowingProfile />
          </Route>
        </Switch>
      </Grid>
    </Grid>
  );
};

export default Profile;
