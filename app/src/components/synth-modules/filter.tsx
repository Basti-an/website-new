import React from "react";
import Tone from "tone";
import { filterStyles } from "../../jss/synth";
import Knob from "../synth/knob";

const useStyles = filterStyles;

interface FilterProps {
  filter: Tone.Filter;
}

const filterDescription =
  "The filter is used to cut away frequencies from the oscillators signal. Try playing around with the cutoff knob to get a feeling for how it works.";

const resonanceDescription =
  "The resonance is the amount of filter signal that is fed back into the filter - creating a feedback around the cutoff frequency.";

// @TODO: implement CV Input to filter frequency
export default function FilterModule({ filter }: FilterProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.plate} title={filterDescription}>
      <div className={classes.topplate} />
      <div className={classes.headertext}>VCF</div>
      <div className={classes.freqKnob}>
        <Knob
          changeInput={(value: number) => {
            // @TODO refactor this mess and find out why the if below works..
            // const lfoAverage =
            //   (window.erebus.lfo.amplitude.value *
            //     (window.erebus.lfo.max - window.erebus.lfo.min)) /
            //   2;
            // console.log(`test ${value - lfoAverage}`);
            // console.log(lfoAverage);
            // const newValue = value - lfoAverage;
            // window.erebus.add.addend.rampTo(newValue);
            window.erebus.filterFreq.rampTo(value, 0);
            // filter.frequency.set({ value });
            // filter.frequency.value = value;
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
            filter.Q.value = value;
          }}
          minVal={3}
          maxVal={33}
          initialValue={7}
        />
      </div>
    </div>
  );
}
