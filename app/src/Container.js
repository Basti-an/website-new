import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import React from "react";
import App from "./App";
import palette from "./theme";

const theme = createMuiTheme(palette);
console.log(ThemeProvider);

function Container() {
  console.log("TEST");
  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
}

export default Container;
