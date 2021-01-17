import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
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
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import "./App.css";
// import HeroAvatar from "./components/hero-avatar";
import HeroImage from "./components/hero-image";
import { getIsMobileOS, getIsGoodBrowser } from "./utils";
import Config from "./config";
const { hostUrl } = Config;

const isMobile = getIsMobileOS();

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    marginTop: 0,
    zIndex: 1,
    backgroundImage: isMobile
      ? `url("${hostUrl}/images/mobileBg.jpg")`
      : `url("${hostUrl}/images/mainBg.jpg")`,
    backgroundAttachment: "fixed",
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
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    fontWeight: 300,
    fontSize: "18pt",
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
    listStyle: "none",
    marginBottom: "2rem",
    marginRight: "auto",
    marginLeft: "auto",
    textDecoration: "none",
    fontWeight: 300,
    color: "#fff",
    borderRadius: "4px",
    padding: "0",
    marginTop: "2rem",
    fontSize: "16pt",
  },
  boxed: {
    backgroundColor: "initial",
    backdropFilter: "blur(18px)",
    borderRadius: "4px",
    padding: "1rem",
    fontWeight: 300,
  },
  switch: { marginRight: 0, float: "right" },
}));

const views = {
  "/cv": { name: "CV", Component: React.lazy(() => import("./pages/cv")) },
  // "/synth": { name: "Synthesizer" Component: React.lazy(() => import("./pages/synth"))},
};

function App() {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [isFlowing, setIsFlowing] = useState(getIsGoodBrowser());

  useEffect(() => {
    const isMobile = getIsMobileOS();
    const bgId = isMobile ? "noiseMobile" : "background";
    const bg = document.getElementById(bgId);
    if (!bg) {
      return;
    }

    if (isFlowing) {
      bg.style.display = "";
    } else {
      bg.style.display = "none";
    }
  }, [isFlowing]);

  return (
    <div className={classes.root}>
      <AppBar className={classes.titlebar} position="static">
        <Toolbar>
          <Grid container className={classes.grid} xs={12}>
            <Grid item xs={1}></Grid>
            <Grid item xs={10}>
              <Typography
                variant="h5"
                color="inherit"
                className={classes.title}
              >
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
              <Grid container className={classes.grid} xs={12}>
                <Grid item sm={1} md={2} lg={1} xl={2} />
                <Grid item xs={12} sm={10} md={8} lg={10} xl={8}>
                  <Grid container>
                    <Grid item xs={12}>
                      <div style={{ marginTop: "2rem" }}>
                        <Paper elevation={16} className={classes.boxed}>
                          <Typography className={classes.headline} variant="h3">
                            Hello There! I`m a Fullstack Software Developer from
                            Cologne, Germany
                          </Typography>
                          <Typography className={classes.headline} variant="h3">
                            Unfortunately, this site is only used for hosting my
                            CV at the moment
                          </Typography>
                        </Paper>
                      </div>
                      <nav>
                        <ul className={classes.links}>
                          <Paper elevation={16} className={classes.boxed}>
                            {Object.entries(views).map(([path, view]) => (
                              <Link style={{ fontSize: "22pt" }} to={path}>
                                <li>{view.name}</li>
                              </Link>
                            ))}
                            {/* <li>
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href="https://github.com/Basti-an/website-new"
                            >
                              Source code
                            </a>
                          </li> */}
                          </Paper>
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
