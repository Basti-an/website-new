import { Grid, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import CVcard from "../components/cvcard.js";
import Config from "../config.js";

const styles = theme => ({
  year: {
    marginTop: theme.spacing.unit * 4 + 2,
    marginBottom: theme.spacing.unit * 3 + 2,
    color: theme.palette.primary.main
  },
  title: {
    marginRight: "auto",
    marginLeft: "auto",
    fontSize: "1.5rem",
    fontStyle: "italic",
    marginBottom: "3rem",
    fontWeight: 400,
    color: theme.palette.primary.main
  },
  grid: {
    paddingBottom: "2rem !important"
  }
});

class CV extends React.Component {
  state = {
    cv: null
  };

  componentDidMount() {
    const hostUrl = Config.hostUrl;
    fetch(`${hostUrl}/cv.json`).then(response => {
      response.json().then(json => {
        const cv = json;
        this.setState({ cv });
      });
    });
  }

  sortDescending(a, b) {
    return parseInt(b, 10) - parseInt(a, 10);
  }

  calculateCardWidth(entries, index) {
    const isLastEntry = index + 1 === entries.length;
    const hasOddNumberOfEntries = !(index % 2);
    let cardWidth = 6;
    if (entries.length === 1) {
      cardWidth = 12;
    } else if (hasOddNumberOfEntries && isLastEntry) {
      cardWidth = 12;
    }
    return cardWidth;
  }

  render() {
    const { cv } = this.state;
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Typography variant="title" color="inherit" className={classes.title}>
          CV
        </Typography>

        {cv &&
          Object.keys(cv)
            .sort(this.sortDescending)
            .map(year => {
              const yearEntries = cv[year];
              const cards = yearEntries.map((entry, index) => {
                return (
                  <Grid
                    item
                    xs={12}
                    lg={this.calculateCardWidth(yearEntries, index)}
                    className={classes.grid}
                  >
                    <CVcard {...entry} />
                  </Grid>
                );
              });

              return (
                <Grid container spacing={16}>
                  <Grid item xs={12}>
                    <Typography className={classes.year} variant="headline">
                      {year}
                    </Typography>
                  </Grid>
                  {cards}
                </Grid>
              );
            })}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(CV);
