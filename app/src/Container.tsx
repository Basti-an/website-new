import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme, ThemeOptions } from "@material-ui/core/styles";
import App from "./App";
import { palette } from "./theme";

const theme = createMuiTheme({ palette } as ThemeOptions);

function Container(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
}

export default Container;
