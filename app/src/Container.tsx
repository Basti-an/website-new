import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme, ThemeOptions } from "@material-ui/core/styles";
import React from "react";
import App from "./App";
import { palette } from "./theme";

const theme = createMuiTheme({ palette } as ThemeOptions);

function Container() {
  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
}

export default Container;
