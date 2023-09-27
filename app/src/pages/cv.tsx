import React, { useState, useEffect } from "react";
import { Grid, GridProps, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import axios from "axios";
import CVcard from "../components/cvcard";
import Config from "../config";
import { CvModel, CvEntry } from "../models/cv";
import { cvStyles } from "../jss";
import { clamp, sortDescending } from "../utils";

const useStyles = cvStyles;

function track3D(e: DeviceOrientationEvent) {
  if (!e) {
    return;
  }
  const x = e.beta || 0;
  const y = e.gamma || 0;
  const cards = [...(document.getElementsByClassName("3D-Card") as HTMLCollectionOf<HTMLElement>)];
  const rotateX = x < 180 ? clamp(Math.abs((x - 90) * -0.4), 360 / 16) * -1 : 0;
  const rotateY = clamp(y * -0.4, 360 / 16);
  cards.forEach((card) => {
    card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;

    const lp = 50 + (rotateX - 50) / 1.5;
    const tp = 50 + (rotateY - 50) / 1.5;
    const pa = 50 - rotateX + (50 - rotateY);
    const opacity = 30 + Math.abs(pa) * 1.5;
    const images = [
      ...(card.getElementsByClassName("foil-overlay") as HTMLCollectionOf<HTMLElement>),
    ];

    for (let i = 0; i < images.length; i += 1) {
      images[i].style.opacity = `${opacity / 100}`;
      images[i].style.backgroundPosition = `${lp}% ${tp}%`;
      images[i].style.filter = `brightness(.66) contrast(${
        ((Math.abs(rotateX) + Math.abs(rotateY)) / 30) * 1.33
      })`;
    }
  });
}

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
