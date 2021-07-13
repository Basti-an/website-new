import React from "react";
import Tone from "tone";
import Knob from "../synth/knob";
import Switch from "../synth/switch";

import { lfoStyles } from "../../jss/synth";
import Config from "../../config";

const useStyles = lfoStyles;

interface LfoProps {
  lfo: Tone.LFO;
  // input: Tone.Filter;
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

const lfoDescription =
  "an LFO (low frequency oscillator) generates a wave that can be used to modulate other parameters. The LFO is currently routed to the frequency of the filter.";

export default function LFOmodule({ lfo }: LfoProps): JSX.Element {
  const classes = useStyles();

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
    <div className={classes.plate} title={lfoDescription}>
      <div className={classes.headertext}>LFO</div>
      <div className={classes.components}>
        <div className={classes.rateKnob}>
          <div className={classes.button}>
            <Knob
              changeInput={(value: number) => {
                lfo.frequency.rampTo(value, 0);
              }}
              minVal={0.1}
              maxVal={200}
              afterSweep={() => {
                setAnimDuration(lfo);
              }}
              whileSweep={() => {
                setAnimDuration(lfo);
              }}
              initialValue={0.6}
            />
          </div>
          <div className={classes.button}>
            <Knob
              changeInput={(value: number) => {
                if (value < 0.05) {
                  lfo.disconnect();
                } else if (window.erebus.lfoTarget) {
                  window.erebus.lfoTarget(lfo);
                }
                lfo.amplitude.linearRampTo(value, 0);
              }}
              minVal={0}
              maxVal={1}
              isLinear
              initialValue={0.3}
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
        <img
          className={classes.waveform}
          src={`${Config.hostUrl}/images/waveform_square_bright.png`}
          alt="square wave"
        />
        <Switch onInput={switchWaveform} />
        <img
          className={classes.waveform}
          src={`${Config.hostUrl}/images/waveform_triangle_bright.png`}
          alt="square wave"
        />
      </div>
    </div>
  );
}
