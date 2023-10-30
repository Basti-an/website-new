import { Grid } from "@material-ui/core";
// import { appStyles } from "../jss";
// import SpaceFillingCurve from "../components/spaceFillingCurve";
import Config from "../config";

// const useStyles = appStyles;

function Home(): JSX.Element {
  // const classes = useStyles();

  return (
    <Grid item xs={12}>
      {/* <Paper elevation={16} className={classes.boxed}>
        <Typography className={classes.headline} variant="h3">
          Hello There :) I&apos;m a Fullstack Software Developer from Cologne, Germany
        </Typography>
        <Typography className={classes.headline} variant="h3">
          Check out this <Link to="/synth">Synthesizer</Link> I&apos;ve built using toneJS !
        </Typography>
      </Paper> */}
      <div className="name-container">
        {/* <SpaceFillingCurve type="Hilbert" scale={3} renderTo=".name-container" /> */}
        <h1 className="frasier-text">
          <p>Sebastian</p> <p>Wiendlocha</p>
        </h1>
      </div>
      <img
        id="cologne"
        src={`${Config.hostUrl}/images/cologne-skyline.svg`}
        alt=""
      />
    </Grid>
  );
}

export default Home;
