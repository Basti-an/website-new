import { Grid, GridProps, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CVcard from "../components/cvcard";
import Config from "../config";
import { CvModel, CvEntry } from "../models/cv";
import { cvStyles } from "../jss";

const useStyles = cvStyles;

function sortDescending(a: string, b: string) {
  return parseInt(b, 10) - parseInt(a, 10);
}

function calculateCardWidth(entries: CvEntry[], index: number) {
  const isLastEntry = index + 1 === entries.length;
  const hasOddNumberOfEntries = !(index % 2);
  let cardWidth = 6;
  if (entries.length === 1) {
    cardWidth = 12;
  } else if (hasOddNumberOfEntries && isLastEntry) {
    cardWidth = 12;
  }
  return cardWidth as GridProps["lg"];
}

function CV(): JSX.Element {
  const theme = useTheme();
  const classes = useStyles(theme);

  const [cv, setCv] = useState({} as CvModel);

  async function init() {
    const { hostUrl } = Config;
    const { data } = await axios.get(`${hostUrl}/cv.json`);
    setCv(data);
  }

  useEffect(() => {
    init();
  }, []);

  if (!cv) {
    return <></>;
  }

  return (
    <>
      {Object.keys(cv)
        .sort(sortDescending)
        .map((year) => {
          const yearEntries = cv[year];
          const cards = yearEntries.map((entry, index) => (
            <Grid item xs={12} lg={calculateCardWidth(yearEntries, index)} className={classes.grid}>
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
