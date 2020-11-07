import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  AppBar, Grid, Toolbar, Typography,
} from "@material-ui/core";
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
    backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
    textAlign: "center",
    // overflowY: "scroll",
    // scrollSnapType: "y mandatory"
  },
  titlebar: {
    backgroundColor: theme.palette.primary.main,
    backgroundImage: `url("${hostUrl}/images/brushed-alum.png")`,
    color: theme.palette.primary.contrastText,
    backgroundBlendMode: "color-burn",
  },
  title: {
    marginRight: "auto",
    marginLeft: "auto",
    fontWeight: 300,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2) - 2,
    height: "100%",
  },
  headline: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    // fontSize: "1.7rem",
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
    marginBottom: theme.spacing(10),
    marginRight: "auto",
    marginLeft: "auto",
    fontStyle: "italic",
    textDecoration: "none",
    fontWeight: 400,
    color: theme.palette.primary.main,
  },
  nav: {
    marginTop: "6rem",
  },
}));

const views = {
  "/cv": React.lazy(() => import("./pages/cv")),
  "/synth": React.lazy(() => import("./pages/synth")),
};

function toUpperCase(s) {
  if (typeof s === "string") {
    return s[0].toUpperCase() + s.slice(1);
  }
  return s;
}

function App() {
  const theme = useTheme();
  const classes = useStyles(theme);

  return (
    <div className={classes.root}>
      <AppBar className={classes.titlebar} position="static">
        <Toolbar>
          <Typography
            variant="h5"
            color="inherit"
            className={classes.title}
          >
            Sebastian Wiendlocha
          </Typography>
        </Toolbar>
      </AppBar>
      <HeroImage />
      <HeroAvatar />
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
                      <Typography className={classes.nav} variant="h4">
                        <div>
                          <nav>
                            <ul className={classes.links}>
                              {Object.entries(views).map(([key]) => (
                                <li>
                                  <Link to={key}>{toUpperCase(key.replace(/\//g, ""))}</Link>
                                </li>
                              ))}
                              <li>
                                <a
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  href="https://github.com/Basti-an/website-new"
                                >
                                  SourceCode @ GitHub
                                </a>
                              </li>
                            </ul>
                          </nav>

                          {Object.entries(views).map(([path, View]) => (<Route
                            key={`${path}`}
                            path={path}
                            exact
                            render={() => <View />}
                          />))}
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
      </React.Suspense>
    </div>
  );
}

export default App;
