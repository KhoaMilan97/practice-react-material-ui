import React, { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import { Route, BrowserRouter, Switch } from "react-router-dom";

import { ThemeProvider } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import Header from "./ui/Header";
import Theme from "./ui/Theme";
import HomeGuest from "./HomeGuest";
import Footer from "./ui/Footer";

import StateContext from "../context/StateContext";
import DispatchContext from "../context/DispatchContext";
import Home from "./Home";
import CreatePost from "./CreatePost";
import ViewSinglePost from "./ViewSinglePost";
import Profile from "./Profile";
import EditPost from "./EditPost";
import NotFound from "./NotFound";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function App() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("token")),
    user: {
      username: localStorage.getItem("username"),
      token: localStorage.getItem("token"),
      avatar: localStorage.getItem("avatar"),
    },
    message: {
      open: false,
      text: "",
      type: "",
    },
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.payload;
        return;
      case "logout":
        draft.loggedIn = false;
        return;
      case "flashMessage":
        draft.message.open = true;
        draft.message.text = action.data.message;
        draft.message.type = action.data.type;
        return;
      case "closeMessage":
        draft.message.open = false;
        return;
      default:
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch({ type: "closeMessage" });
  };

  useEffect(
    () => {
      if (state.loggedIn) {
        localStorage.setItem("username", state.user.username);
        localStorage.setItem("avatar", state.user.avatar);
        localStorage.setItem("token", state.user.token);
      } else {
        localStorage.removeItem("username");
        localStorage.removeItem("avatar");
        localStorage.removeItem("token");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.loggedIn]
  );

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <ThemeProvider theme={Theme}>
          <BrowserRouter>
            <Header />
            <Switch>
              <Route path="/" exact>
                {state.loggedIn ? <Home /> : <HomeGuest />}
              </Route>
              <Route path="/create">
                <CreatePost />
              </Route>
              <Route exact path="/post/:id">
                <ViewSinglePost />
              </Route>
              <Route path="/post/:id/edit">
                <EditPost />
              </Route>
              <Route path="/profile/:username">
                <Profile />
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>

            <Footer />
            <Snackbar
              open={state.message.open}
              autoHideDuration={3000}
              onClose={handleClose}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert onClose={handleClose} severity={state.message.type}>
                {state.message.text}
              </Alert>
            </Snackbar>
          </BrowserRouter>
        </ThemeProvider>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
