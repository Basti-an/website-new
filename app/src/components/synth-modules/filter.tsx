import React from "react";
import { filterStyles } from "../../jss/synth";
import Filter from "../../synth/filter";
import Knob from "../synth/knob";

const useStyles = filterStyles;

const filterDescription =
  "The filter is used to cut away frequencies from the oscillators signal. Try playing around with the cutoff knob to get a feeling for how it works.";

const resonanceDescription =
  "The resonance is the amount of filter signal that is fed back into the filter - creating a feedback around the cutoff frequency.";

interface IFilterProps {
  filter: Filter;
}

export default function FilterModule({ filter }: IFilterProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.plate} title={filterDescription}>
      <div className={classes.topplate} />
      <div className={classes.headertext}>VCF</div>
      <div className={classes.freqKnob}>
        <Knob
          onChange={(value: number) => {
            filter.frequency.rampTo(value, 0);
          }}
          min={10}
          max={20000}
          initial={70}
          isBig
        />
      </div>
      <div className={classes.text}>Cutoff</div>
      <div className={classes.bottomplate}>resonance</div>
      <div className={classes.resKnob} title={resonanceDescription}>
        <Knob
          onChange={(value: number) => {
            filter.filter.Q.value = value;
          }}
          min={3}
          max={33}
          initial={7}
        />
      </div>
    </div>
  );
}
