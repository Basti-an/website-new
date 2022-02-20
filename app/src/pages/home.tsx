import React from "react";
import { Grid, Typography, Paper } from "@material-ui/core";
import { Link } from "react-router-dom";
import { appStyles } from "../jss";

const useStyles = appStyles;

function Home(): JSX.Element {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Paper elevation={16} className={classes.boxed}>
        <Typography className={classes.headline} variant="h3">
          Hello There :) I&apos;m a Fullstack Software Developer from Cologne, Germany
        </Typography>
        <Typography className={classes.headline} variant="h3">
          Check out this <Link to="/synth">Synthesizer</Link> I&apos;ve built for the web!
        </Typography>
      </Paper>
    </Grid>
  );
}

export default Home;
