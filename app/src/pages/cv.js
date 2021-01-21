import { Grid, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CVcard from "../components/cvcard";
import Config from "../config";

const useStyles = makeStyles((theme) => ({
  yearContainer: {
    marginTop: theme.spacing(4) + 2,
    marginBottom: theme.spacing(3) + 2,
    color: theme.palette.primary.main,
  },
  year: {
    fontWeight: 300,
    color: "#fff",
    backdropFilter: "blur(18px)",
    borderRadius: "4px",
  },
  title: {
    marginRight: "auto",
    marginLeft: "auto",
    // fontSize: "1.5rem",
    fontStyle: "italic",
    marginBottom: "3rem",
    fontWeight: 400,
    color: theme.palette.primary.main,
  },
  grid: {
    paddingBottom: "1rem !important",
    paddingTop: "1rem !important",
  },
  spacer: {
    width: "100%",
    margin: "6rem 0",
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
  const theme = useTheme();
  const classes = useStyles(theme);

  const [cv, setCv] = useState(null);

  async function init() {
    const { hostUrl } = Config;
    const { data } = await axios.get(`${hostUrl}/cv.json`);
    setCv(data);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      {cv &&
        Object.keys(cv)
          .sort(sortDescending)
          .map((year) => {
            const yearEntries = cv[year];
            const cards = yearEntries.map((entry, index) => (
              <Grid
                item
                xs={12}
                lg={calculateCardWidth(yearEntries, index)}
                className={classes.grid}
              >
                <CVcard {...entry} />
              </Grid>
            ));

            return (
              <Grid container spacing={4}>
                <Grid className={classes.yearContainer} item xs={12}>
                  <Typography className={classes.year} variant="h3">
                    {year}
                  </Typography>
                </Grid>
                {cards}
              </Grid>
            );
          })}
      <div className={classes.spacer} />
    </>
  );
}

export default CV;
