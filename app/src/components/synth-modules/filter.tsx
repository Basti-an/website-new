import React from "react";
import Tone from "tone";
import { IFilter } from "../../interfaces/filter";
import { filterStyles } from "../../jss/synth";
import Knob from "../synth/knob";

const useStyles = filterStyles;

const filterDescription =
  "The filter is used to cut away frequencies from the oscillators signal. Try playing around with the cutoff knob to get a feeling for how it works.";

const resonanceDescription =
  "The resonance is the amount of filter signal that is fed back into the filter - creating a feedback around the cutoff frequency.";

interface IFilterProps {
  filter: IFilter;
}

// @TODO: implement CV Input to filter frequency
export default function FilterModule({ filter }: IFilterProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.plate} title={filterDescription}>
      <div className={classes.topplate} />
      <div className={classes.headertext}>VCF</div>
      <div className={classes.freqKnob}>
        <Knob
          changeInput={(value: number) => {
            filter.frequency.rampTo(value, 0);
          }}
          minVal={32}
          maxVal={20000}
          initialValue={333}
          isBig
        />
      </div>
      <div className={classes.text}>Cutoff</div>
      <div className={classes.bottomplate}>resonance</div>
      <div className={classes.resKnob} title={resonanceDescription}>
        <Knob
          changeInput={(value: number) => {
            filter.filter.Q.value = value;
          }}
          minVal={3}
          maxVal={33}
          initialValue={7}
        />
      </div>
    </div>
  );
}
