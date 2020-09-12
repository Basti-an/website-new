import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/styles";
import { AppBar, Grid, Toolbar, Typography } from "@material-ui/core";
import classNames from "classnames";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import "./App.css";
import HeroAvatar from "./components/hero-avatar";
import HeroImage from "./components/hero-image";
import CV from "./pages/cv.js";
import Synth from "./pages/synth.js";

//@TODO implement detection of mobile user-agent for mobile-only features

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    marginTop: 0,
    zIndex: 1,
    backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
    // overflowY: "scroll",
    // scrollSnapType: "y mandatory"
  },
  titlebar: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  title: {
    marginRight: "auto",
    marginLeft: "auto",
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 2 - 2,
    height: "100%",
  },
  headline: {
    marginBottom: theme.spacing.unit * 2,
    fontSize: "1.7rem",
    color: theme.palette.primary.main,
  },
  grid: {
    // scrollSnapAlign: "center"
    maxWidth: 1800,
    marginRight: "auto",
    marginLeft: "auto",
  },
  links: {
    paddingLeft: 0,
    listStyle: "none",
    marginBottom: theme.spacing.unit * 10,
  },
  nav: {
    fontWeight: 500,
  },
}));

// TODO: consider refactoring into stateless functional component
function App() {
  const theme = useTheme();
  console.log(theme);
  const classes = useStyles(theme);

  return (
    <div className={classNames("App", classes.root)}>
      <Router>
        <>
          <AppBar className={classes.titlebar} position="static">
            <Toolbar>
              <Typography
                variant="title"
                color="inherit"
                className={classes.title}
              >
                Sebastian Wiendlocha
              </Typography>
            </Toolbar>
          </AppBar>
          <HeroImage />
          <HeroAvatar />
          <div className={classes.content}>
            <Grid container className={classes.grid} xs={12}>
              <Grid item sm={1} md={2} lg={1} xl={2} />
              <Grid item xs={12} sm={10} md={8} lg={10} xl={8}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography className={classes.headline} variant="headline">
                      Fullstack Software Developer based in Cologne, Germany
                    </Typography>
                    <Typography className={classes.nav} variant="subheading">
                      <div>
                        <nav>
                          <ul className={classes.links}>
                            <li>
                              <Link to="/cv/">CV</Link>
                            </li>
                            <li>
                              <Link to="/synth/">Synthesizer</Link>
                            </li>
                            <li>
                              <a
                                target="_blank"
                                href="https://github.com/Basti-an/website-new"
                              >
                                SourceCode @ GitHub
                              </a>
                            </li>
                          </ul>
                        </nav>
                        <Route path="/cv/" component={CV} />
                        <Route path="/synth/" component={Synth} />
                      </div>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid sm={1} md={2} lg={1} xl={2} />
            </Grid>
          </div>
        </>
      </Router>
    </div>
  );
}

export default App;
