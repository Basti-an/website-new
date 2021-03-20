import React from "react";
import Tone from "tone";
import { filterStyles } from "../../jss/synth";
import Knob from "../synth/knob";

const useStyles = filterStyles;

interface FilterProps {
  filter: Tone.Filter;
}

// @TODO: implement CV Input to filter frequency
export default function FilterModule({ filter }: FilterProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.plate}>
      <div className={classes.topplate} />
      <div className={classes.headertext}>VCF</div>
      <div className={classes.freqKnob}>
        <Knob
          changeInput={(value: number) => {
            filter.frequency.value = value;
            console.log(filter.frequency.value);
          }}
          minVal={32}
          maxVal={20000}
          initialValue={30}
          isBig
        />
      </div>
      <div className={classes.text}>Cutoff</div>
      <div className={classes.bottomplate}>resonance</div>
      <div className={classes.resKnob}>
        <Knob
          changeInput={(value: number) => {
            filter.Q.value = value;
          }}
          minVal={1}
          maxVal={30}
          initialValue={30}
        />
      </div>
    </div>
  );
}
