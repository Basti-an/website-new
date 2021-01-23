import React, { useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import {
  AppBar,
  Grid,
  Toolbar,
  Typography,
  FormControlLabel,
  Switch,
  Paper,
  Tooltip,
} from "@material-ui/core";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
// I would use a picture of myself on my website if my self esteem would't be so low at the moment
// import HeroAvatar from "./components/hero-avatar";
import HeroImage from "./components/hero-image";
import Navigation from "./components/navigation";
import { getIsMobileOS, getIsGoodBrowser, checkForDevicePerformance } from "./utils";
import { appStyles } from "./jss";

const isMobile = getIsMobileOS();

// @TODO externalize JSS classes
const useStyles = appStyles;

const views = {
  "/cv": { name: "CV", Component: React.lazy(() => import("./pages/cv")) },
  // Synthesizer is currently not available due to tone.js being a harsh mistress
  // "/synth": { name: "Synthesizer" Component: React.lazy(() => import("./pages/synth"))},
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
      <AppBar className={classes.titlebar} position="static">
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
      <HeroImage />
      <React.Suspense fallback={<span>Loading content...</span>}>
        <Router>
          <>
            <div className={classes.content}>
              <Grid container className={classes.grid}>
                <Grid item sm={1} md={2} lg={1} xl={2} />

                <Grid item xs={12} sm={10} md={8} lg={10} xl={8}>
                  <Grid container>
                    <Grid item xs={12}>
                      <div style={{ marginTop: "2rem" }}>
                        <Paper elevation={16} className={classes.boxed}>
                          <Typography className={classes.headline} variant="h3">
                            Hello There! I`m a Fullstack Software Developer from Cologne, Germany
                          </Typography>
                          <Typography className={classes.headline} variant="h3">
                            Unfortunately, this site is only used for hosting my CV at the moment
                          </Typography>
                        </Paper>
                      </div>
                      {/* <nav>
                        <ul className={classes.links}>
                          <Paper elevation={16} className={classes.boxed}>
                            {Object.entries(views).map(([path, view]) => (
                              <Link style={{ fontSize: "22pt" }} to={path}>
                                <li>{view.name}</li>
                              </Link>
                            ))}
                            // link to this sites github repo, very meta
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href="https://github.com/Basti-an/website-new"
                            >
                              Source code
                            </a>
                          </li> 
                          </Paper>
                        </ul>
                      </nav> */}
                    </Grid>

                    {/** **********************
                     ****                  ****
                     ****    ACTUAL VIEW   ****
                     ****                  ****
                     ************************ */}
                    <Grid item xs={12}>
                      {Object.entries(views).map(([path, view]) => {
                        const { Component } = view;
                        return (
                          <Route key={`${path}`} path={path} exact render={() => <Component />} />
                        );
                      })}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item sm={1} md={2} lg={1} xl={2} />
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
