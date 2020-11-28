import React, { useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { AppBar, Grid, Toolbar, Typography } from "@material-ui/core";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import "./App.css";
import HeroAvatar from "./components/hero-avatar";
import HeroImage from "./components/hero-image";
import Config from "./config";

const { hostUrl } = Config;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    marginTop: 0,
    zIndex: 1,
    // backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
    textAlign: "center",
    // overflowY: "scroll",
    // scrollSnapType: "y mandatory"
  },
  titlebar: {
    transform: "translate3d(0,0,0)",
    backgroundColor: "rgba(42,42,42,0.5)",
    backdropFilter: "blur(28px)",
    color: theme.palette.primary.contrastText,
    // backgroundBlendMode: "color-burn",
    zIndex: 10000,
    position: "fixed",
  },
  title: {
    marginRight: "auto",
    marginLeft: "auto",
    fontWeight: 300,
  },
  content: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2) - 2,
    paddingTop: 64,
    height: "100%",
    position: "relative",
    zIndex: 1000,
  },
  headline: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    // fontSize: "1.7rem",
    color: "#fff",
  },
  grid: {
    // scrollSnapAlign: "center"
    maxWidth: 1800,
    marginRight: "auto",
    marginLeft: "auto",
  },
  links: {
    "&:visited": {
      color: "#fff",
    },
    paddingLeft: 0,
    listStyle: "none",
    marginBottom: "2rem",
    marginRight: "auto",
    marginLeft: "auto",
    textDecoration: "none",
    fontWeight: 300,
    color: "#fff",
    backdropFilter: "blur(18px)",
    borderRadius: "4px",
    padding: "1rem",
    marginTop: "4rem",
    fontSize: "16pt",
  },
}));

const views = {
  "/cv": { name: "CV", Component: React.lazy(() => import("./pages/cv")) },
  // "/synth": { name: "Synthesizer" Component: React.lazy(() => import("./pages/synth"))},
};

function App() {
  const theme = useTheme();
  const classes = useStyles(theme);

  return (
    <div className={classes.root}>
      <AppBar className={classes.titlebar} position="static">
        <Toolbar>
          <Typography variant="h5" color="inherit" className={classes.title}>
            Sebastian Wiendlocha
          </Typography>
        </Toolbar>
      </AppBar>
      <HeroImage />
      <React.Suspense fallback={<span>Loading content...</span>}>
        <Router>
          <>
            <div className={classes.content}>
              <Grid container className={classes.grid} xs={12}>
                <Grid item sm={1} md={2} lg={1} xl={2} />
                <Grid item xs={12} sm={10} md={8} lg={10} xl={8}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography className={classes.headline} variant="h4">
                        Fullstack Software Developer based in Cologne, Germany
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <HeroAvatar />
                    </Grid>
                    <Grid item xs={6}>
                      <nav>
                        <ul className={classes.links}>
                          {Object.entries(views).map(([path, view]) => (
                            <li>
                              <Link to={path}>{view.name}</Link>
                            </li>
                          ))}
                          <li>
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href="https://github.com/Basti-an/website-new"
                            >
                              Source code
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </Grid>
                    <Grid item xs={12}>
                      {Object.entries(views).map(([path, view]) => {
                        const { Component } = view;
                        return (
                          <Route
                            key={`${path}`}
                            path={path}
                            exact
                            render={() => <Component />}
                          />
                        );
                      })}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid sm={1} md={2} lg={1} xl={2} />
              </Grid>
            </div>
          </>
        </Router>
      </React.Suspense>
    </div>
  );
}

export default App;
