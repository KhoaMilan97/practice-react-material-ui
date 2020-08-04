import { createMuiTheme } from "@material-ui/core/styles";

const green = "#28a745";
const blue = "#007bff";
const gray = "#6c757d";

export default createMuiTheme({
  palette: {
    common: {
      green: green,
      blue: blue,
      gray: gray,
    },
    primary: {
      main: `${blue}`,
    },
    secondary: {
      main: `${green}`,
    },
  },
  typography: {
    body1: {
      color: gray,
    },
    body2: {
      color: gray,
      lineHeight: 2,
    },
    h2: {
      fontFamily: "inherit",
      fontWeight: 500,
      lineHeight: 1.2,
      color: "inherit",
      fontSize: "2rem",
    },
  },
});
