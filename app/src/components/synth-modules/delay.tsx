import React from "react";
import Tone from "tone";
import Knob from "../synth/knob";
import { delayStyles } from "../../jss/synth";

const useStyles = delayStyles;

interface DelayProps {
  evaluateConnection?: (value: number) => void;
  delay: Tone.FeedbackDelay;
}

const delayDescription =
  "The delay feeds the signal back into itself with a timed delay, creating an echo. " +
  "The feedback adjusts the amount of signal that get fed back, while the mix knob determines how much of the delayed signal is mixed into the audio output";

// @TODO: implement CV Input to filter frequency
export default function DelayModule({
  evaluateConnection = () => {},
  delay,
}: DelayProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.plate} title={delayDescription}>
      <div className={classes.headertext}>Echo</div>
      <div className={classes.rateKnob}>
        <div className={classes.button}>
          <Knob
            onChange={(value) => {
              delay.delayTime.rampTo(value, window.erebus.output.blockTime * 42);
            }}
            min={0.1}
            max={1.0}
            initial={0.5}
            name="delay-time"
          />
        </div>
        <div className={classes.button}>
          <Knob
            onChange={(value) => {
              delay.feedback.rampTo(value, 0);
            }}
            min={0.1}
            max={1.0}
            afterSweep={evaluateConnection}
            whileSweep={evaluateConnection}
            isLinear
            initial={0.25}
            name="delay-feedback"
          />
        </div>
        <div className={classes.button}>
          <Knob
            onChange={(value) => {
              delay.wet.rampTo(value, 0);
            }}
            min={0}
            max={1}
            afterSweep={evaluateConnection}
            whileSweep={evaluateConnection}
            isLinear
            initial={0}
            name="delay-wet"
          />
        </div>
      </div>
      <div className={classes.textContainer}>
        <div className={classes.text}>time</div>
        <div className={classes.text}>feed</div>
        <div className={classes.text}>mix</div>
      </div>
    </div>
  );
}
