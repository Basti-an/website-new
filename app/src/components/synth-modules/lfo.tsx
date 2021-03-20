import React from "react";
import Tone from "tone";
import Knob from "../synth/knob";
import Switch from "../synth/switch";

import { lfoStyles } from "../../jss/synth";

const useStyles = lfoStyles;

interface LfoProps {
  lfo: Tone.LFO;
  input: Tone.Filter;
}

const setAnimDuration = (lfo: Tone.LFO) => {
  // make lfo led blink according to lfo rate
  const freq = lfo.frequency.value as number;
  const duration = (1 / freq).toFixed(3);
  const led = document.getElementById("led");
  if (!led) {
    return;
  }
  led.style.animation = `flickerAnimation ${duration}s infinite`;
};

export default function LFOmodule({ lfo, input }: LfoProps): JSX.Element {
  const classes = useStyles();

  function evaluateConnection(value: number) {
    console.log(input);
    // disconnect lfo if value is below certain treshold
    if (value < 1.05) {
      const currInputValue = input && input.frequency.value;
      lfo.disconnect();
      input.frequency.value = currInputValue;
      return;
    }
    // if (typeof this.props.input.value !== "undefined") {

    // }
    lfo.connect(input);
  }

  function switchWaveform(isSquare: boolean) {
    lfo.stop();
    if (isSquare) {
      lfo.type = "square";
    } else {
      lfo.type = "triangle";
    }
    lfo.start();
  }

  return (
    <div className={classes.plate}>
      <div className={classes.headertext}>LFO</div>
      <div className={classes.components}>
        <div className={classes.rateKnob}>
          <div className={classes.button}>
            <Knob
              changeInput={(value: number) => {
                lfo.frequency.value = value;
              }}
              minVal={0.1}
              maxVal={200}
              afterSweep={() => {
                setAnimDuration(lfo);
              }}
              whileSweep={() => {
                setAnimDuration(lfo);
              }}
            />
          </div>
          <div className={classes.button}>
            <Knob
              changeInput={(value: number) => {
                lfo.amplitude.value = value - 1;
              }}
              minVal={1}
              maxVal={2}
              afterSweep={evaluateConnection}
              whileSweep={evaluateConnection}
              isLinear
              initialValue={0}
            />
          </div>
        </div>
        <div className={classes.textContainer}>
          <div className={classes.text}>rate</div>
          <div className={classes.ledContainer}>
            <div className={classes.ledOff} />
            <div id="led" className={classes.ledOn} />
          </div>
          <div className={classes.text}>depth</div>
        </div>
      </div>
      <div className={classes.shape}>
        <div className={classes.switchText}>⎍</div>
        <Switch onInput={switchWaveform} />
        <div className={classes.switchText}>⟁</div>
      </div>
    </div>
  );
}
