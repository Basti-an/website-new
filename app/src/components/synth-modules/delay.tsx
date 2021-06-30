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
            changeInput={(value) => {
              delay.delayTime.rampTo(value, window.erebus.output.blockTime * 42);
            }}
            minVal={0.1}
            maxVal={1.0}
            initialValue={0.5}
          />
        </div>
        <div className={classes.button}>
          <Knob
            changeInput={(value) => {
              delay.feedback.rampTo(value, 0);
            }}
            minVal={0.1}
            maxVal={1.0}
            afterSweep={evaluateConnection}
            whileSweep={evaluateConnection}
            isLinear
            initialValue={0.25}
          />
        </div>
        <div className={classes.button}>
          <Knob
            changeInput={(value) => {
              delay.wet.rampTo(value, 0);
            }}
            minVal={0}
            maxVal={1}
            afterSweep={evaluateConnection}
            whileSweep={evaluateConnection}
            isLinear
            initialValue={0}
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
