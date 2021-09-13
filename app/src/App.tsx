import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useTheme } from "@material-ui/core/styles";
import {
  AppBar,
  Grid,
  Toolbar,
  Typography,
  FormControlLabel,
  Switch,
  Tooltip,
} from "@material-ui/core";
import Background from "./components/background";
import Navigation from "./components/navigation";
import { getIsMobileOS, getIsGoodBrowser, checkForDevicePerformance } from "./utils";
import { appStyles } from "./jss";

const isMobile = getIsMobileOS();

// @TODO externalize JSS classes
const useStyles = appStyles;

const views = {
  // "/cv": { name: "CV", Component: React.lazy(() => import("./pages/cv")) },
  // Synthesizer is currently not available due to tone.js being a harsh mistress
  "/synth": { name: "Synthesizer", Component: React.lazy(() => import("./pages/synth")) },
  "/": { name: "Home", Component: React.lazy(() => import("./pages/home")) },
};

function App(): JSX.Element {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [isFlowing, setIsFlowing] = useState(getIsGoodBrowser());

  useEffect(() => {
    // flowing background is different between desktop and mobile
    // this should not be of concern to this component, and should be refactored
    // maybe navigation.js can export this
    const bgId = isMobile ? "noiseMobile" : "background";
    const bg = document.getElementById(bgId);
    if (!bg) {
      return;
    }

    // old school
    if (isFlowing) {
      bg.style.display = "";
    } else {
      bg.style.display = "none";
    }
  }, [isFlowing]);

  useEffect(() => {
    checkForDevicePerformance(setIsFlowing);
  }, []);

  return (
    <div className={classes.root}>
      <AppBar className={classes.titlebar} position="relative">
        <Toolbar>
          <Grid container className={classes.grid} style={{ maxWidth: "initial" }}>
            <Grid item xs={1}>
              {/* spacing so next element will be properly mid-aligned */}
            </Grid>

            <Grid item xs={10}>
              <Typography variant="h5" color="inherit" className={classes.title}>
                Sebastian Wiendlocha
              </Typography>
            </Grid>

            <Grid item xs={1}>
              <Tooltip title='Toggle "flowing" background'>
                <FormControlLabel
                  className={classes.switch}
                  control={
                    <Switch
                      checked={isFlowing}
                      onChange={() => setIsFlowing(!isFlowing)}
                      name="beWater"
                    />
                  }
                  label=""
                />
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Background />
      <React.Suspense fallback={<span>Loading content...</span>}>
        <Router>
          <>
            <div className={classes.content}>
              <Grid container className={classes.grid}>
                <Grid item lg={1} xl={2} />

                <Grid item xs={12} lg={10} xl={8}>
                  <Grid container>
                    <Grid item xs={12}>
                      {Object.entries(views).map(([path, view]) => {
                        const { Component, name } = view;

                        return (
                          <Route
                            key={`${name}`}
                            path={path}
                            exact
                            render={() => <Component setIsFlowing={setIsFlowing} />}
                          />
                        );
                      })}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={1} xl={2} />
              </Grid>
            </div>
          </>
          <Navigation />
        </Router>
      </React.Suspense>
    </div>
  );
}

export default App;
