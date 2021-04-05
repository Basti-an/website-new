import React from "react";
import * as Tone from "tone";
import Knob from "../synth/knob";
import Switch from "../synth/switch";

import { oscStyles } from "../../jss/synth";

const useStyles = oscStyles;

interface OscProps {
  osc1: Tone.OmniOscillator<Tone.Oscillator>;
  osc2: Tone.OmniOscillator<Tone.Oscillator>;
  changeOscOctave: (osc: "one" | "two", octave: number) => void;
}

const oscDescription =
  "These oscillators create the sound that is shaped by the other components, you can change the pitch and octave of each oscillator using the knobs and switches";

export default function OSCModule({ osc1, osc2, changeOscOctave }: OscProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.plate} title={oscDescription}>
      <div className={classes.headertext}>OSC</div>
      <div className={classes.tuneKnobs}>
        <div className={classes.button}>
          <Knob
            changeInput={(value: number) => {
              osc1.detune.value = value - 500;
              // @TODO, take osc2 detune into account
              osc2.detune.value = value - 500;
            }}
            isBig
            isLinear
            minVal={0}
            maxVal={1000}
            initialValue={500}
          />
        </div>
        <div className={classes.button}>
          <Knob
            changeInput={(value: number) => {
              osc2.detune.value = value - 500;
            }}
            isBig
            isLinear
            minVal={0}
            maxVal={1000}
            initialValue={530}
          />
        </div>
      </div>
      <div className={classes.switches}>
        <div className={classes.inlineText}>8 16</div>
        <Switch
          onInput={(active: boolean) => {
            if (active) {
              changeOscOctave("one", 0);
            } else {
              changeOscOctave("one", -1);
            }
          }}
          initialState={0}
        />

        <Switch
          onInput={(active: boolean) => {
            if (active) {
              changeOscOctave("two", 1);
            } else {
              changeOscOctave("two", 0);
            }
          }}
          initialState={0}
        />
        <div className={classes.inlineText}>4 8</div>
      </div>
      <div className={classes.textContainer} />
    </div>
  );
}
