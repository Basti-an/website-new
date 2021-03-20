import React from "react";
import Tone from "tone";
import Knob from "../synth/knob";
import { delayStyles } from "../../jss/synth";

const useStyles = delayStyles;

interface DelayProps {
  evaluateConnection: (value: number) => void;
  delay: Tone.FeedbackDelay;
}

// @TODO: implement CV Input to filter frequency
export default function DelayModule({ evaluateConnection, delay }: DelayProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.plate}>
      <div className={classes.headertext}>Echo</div>
      <div className={classes.rateKnob}>
        <div className={classes.button}>
          <Knob
            changeInput={(value) => {
              delay.delayTime.value = value;
            }}
            minVal={0.01}
            maxVal={0.99}
            initialValue={60}
          />
        </div>
        <div className={classes.button}>
          <Knob
            changeInput={(value) => {
              delay.feedback.value = value;
            }}
            minVal={0.01}
            maxVal={1.0}
            afterSweep={evaluateConnection}
            whileSweep={evaluateConnection}
            isLinear
            initialValue={115}
          />
        </div>
        <div className={classes.button}>
          <Knob
            changeInput={(value) => {
              delay.wet.value = value;
            }}
            minVal={0.01}
            maxVal={0.99}
            afterSweep={evaluateConnection}
            whileSweep={evaluateConnection}
            isLinear
            initialValue={30}
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
