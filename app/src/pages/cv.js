import { Grid, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import CVcard from "../components/cvcard.js";
import Config from "../config.js";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  year: {
    marginTop: theme.spacing.unit * 4 + 2,
    marginBottom: theme.spacing.unit * 3 + 2,
    color: theme.palette.primary.main,
  },
  title: {
    marginRight: "auto",
    marginLeft: "auto",
    fontSize: "1.5rem",
    fontStyle: "italic",
    marginBottom: "3rem",
    fontWeight: 400,
    color: theme.palette.primary.main,
  },
  grid: {
    paddingBottom: "1rem !important",
    paddingTop: "1rem !important",
  },
}));

function sortDescending(a, b) {
  return parseInt(b, 10) - parseInt(a, 10);
}

function calculateCardWidth(entries, index) {
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

function CV() {
  const [cv, setCv] = useState(null);
  const theme = useTheme();
  const classes = useStyles(theme);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const hostUrl = Config.hostUrl;
    const { data } = await axios.get(`${hostUrl}/cv.json`);
    setCv(data);
  }

  return (
    <React.Fragment>
      <Typography variant="title" color="inherit" className={classes.title}>
        CV
      </Typography>

      {cv &&
        Object.keys(cv)
          .sort(sortDescending)
          .map((year) => {
            const yearEntries = cv[year];
            const cards = yearEntries.map((entry, index) => {
              return (
                <Grid
                  item
                  xs={12}
                  lg={calculateCardWidth(yearEntries, index)}
                  className={classes.grid}
                >
                  <CVcard {...entry} />
                </Grid>
              );
            });

            return (
              <Grid container spacing={4}>
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

export default CV;
