import React from "react";
import Knob from "../synth/knob";
import Switch from "../synth/switch";

import { lfoStyles } from "../../jss/synth";
import Config from "../../config";
import LFO from "../../classes/synth/lfo";

const useStyles = lfoStyles;

interface LfoProps {
  lfo: LFO;
  // input: Tone.Filter;
}

const setLedAnimationDuration = (frequency: number) => {
  // make lfo led blink according to lfo rate
  if (frequency <= 0) {
    return;
  }

  const duration = (1 / frequency).toFixed(3);

  const led = document.getElementById("lfo-led");
  if (!led) {
    return;
  }
  led.style.animation = `flickerAnimation ${duration}s infinite`;
};

const lfoDescription =
  "an LFO (low frequency oscillator) generates a wave that can be used to modulate parameters of other synthesizer modules. The LFO is currently routed to the frequency of the filter.";

const switchWaveform = (lfo: LFO) => (isSquare: boolean) => {
  lfo.lfo.stop();
  if (isSquare) {
    lfo.lfo.type = "square";
  } else {
    lfo.lfo.type = "triangle";
  }
  lfo.lfo.start();
};

export default function LFOmodule({ lfo }: LfoProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.plate} title={lfoDescription}>
      <div className={classes.headertext}>LFO</div>
      <div className={classes.components}>
        <div className={classes.rateKnob}>
          <div className={classes.button}>
            <Knob
              onChange={(value: number) => {
                lfo.lforate.rampTo(value, 0);
              }}
              min={0.1}
              max={150}
              whileSweep={() => {
                setLedAnimationDuration(lfo.lforate.value as number);
              }}
              initial={0.6}
              name="lfo-rate"
            />
          </div>
          <div className={classes.button}>
            <Knob
              onChange={(value: number) => {
                lfo.lfo.amplitude.linearRampTo(value, 0);
              }}
              min={0}
              max={1}
              isLinear
              initial={0.3}
              name="lfo-amplitude"
            />
          </div>
        </div>
        <div className={classes.textContainer}>
          <div className={classes.text}>rate</div>
          <div className={classes.ledContainer}>
            <div className={classes.ledOff} />
            <div id="lfo-led" className={classes.ledOn} />
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
        <Switch onInput={switchWaveform(lfo)} name="lfo-waveform" />
        <img
          className={classes.waveform}
          src={`${Config.hostUrl}/images/waveform_triangle_bright.png`}
          alt="square wave"
        />
      </div>
    </div>
  );
}
