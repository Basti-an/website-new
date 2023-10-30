import { useState, useEffect } from "react";
import { Grid, GridProps, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import CVcard from "../components/cvcard";
import Config from "../config";
import { CvModel, CvEntry } from "../models/cv";
import { cvStyles } from "../jss";
import { sortDescending } from "../utils";

const useStyles = cvStyles;

function calculateCardWidth(entries: CvEntry[], index: number) {
  const isLastEntry = index === entries.length - 1;
  const hasOddNumberOfEntries = !(index % 2);
  let cardWidth = 6;
  if (entries.length === 1) {
    cardWidth = 12;
  } else if (hasOddNumberOfEntries && isLastEntry) {
    cardWidth = 12;
  }
  return cardWidth as GridProps["lg"];
}

// interface CVProps {}

function CV(): JSX.Element {
  const theme = useTheme();
  const classes = useStyles(theme);

  const [cv, setCv] = useState({} as CvModel);

  useEffect(() => {
    (async () => {
      const { hostUrl } = Config;
      const body = await fetch(`${hostUrl}/cv.json`);
      const data = (await body.json()) as CvModel;
      setCv(data);
    })();
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
            <Grid
              item
              xs={12}
              lg={calculateCardWidth(yearEntries, index)}
              className={classes.grid}
              key={entry.title}
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
