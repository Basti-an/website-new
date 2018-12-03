import { MuiThemeProvider } from "@material-ui/core/styles";
import React, { Component } from "react";
import App from "./App";
import { theme } from "./theme";

class Container extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    );
  }
}
export default Container;
