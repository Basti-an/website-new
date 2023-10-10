import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useTheme } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import Background from "./components/background";
import Navigation from "./components/navigation";
import { appStyles } from "./jss";

// const isMobile = getIsMobileOS();

// @TODO externalize JSS classes
const useStyles = appStyles;

const views = {
  "/cv": { name: "CV", Component: React.lazy(() => import("./pages/cv")) },
  "/synth": { name: "Synthesizer", Component: React.lazy(() => import("./pages/synth")) },
  "/": { name: "Home", Component: React.lazy(() => import("./pages/home")) },
};

function App(): JSX.Element {
  const theme = useTheme();
  const classes = useStyles(theme);

  return (
    <div className={classes.root}>
      <Background />
      <React.Suspense fallback={<></>}>
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
                          <Route key={`${name}`} path={path} exact render={() => <Component />} />
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
