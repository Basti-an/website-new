import React from "react";
import { Grid, Typography, Paper } from "@material-ui/core";
import { Link } from "react-router-dom";
import { appStyles } from "../jss";

// @TODO externalize JSS classes
const useStyles = appStyles;

function Home(): JSX.Element {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Paper elevation={16} className={classes.boxed}>
        <Typography className={classes.headline} variant="h3">
          Hello There! I`m a Fullstack Software Developer from Cologne, Germany
        </Typography>
        <Typography className={classes.headline} variant="h3">
          Check out this <Link to="/synth">Synthesizer</Link> I&apos;m currently building for the
          web
        </Typography>
      </Paper>
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
  );
}

export default Home;
