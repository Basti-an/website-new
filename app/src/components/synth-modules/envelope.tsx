import classNames from "classnames";
import React from "react";
import Tone from "tone";
import { envelopeStyles } from "../../jss/synth";

import Knob from "../synth/knob";

const useStyles = envelopeStyles;

interface EnvelopeProps {
  envelope: Tone.Envelope;
  filterScaler: Tone.Scale;
}

interface ADSRButtonProps {
  minVal: number;
  maxVal: number;
  initialValue: number;
  onChange: (input: number) => void;
  text: string;
  isLinear?: boolean;
}

type ADSRPhase = "attack" | "decay" | "sustain" | "release";

const envelopeDescription =
  "The envelope gets triggered every time a note is played and consists of four phases - attack, decay, sustain, release. Hit up ADSR on wikipedia to learn more";

function ADSRButton({ minVal, maxVal, initialValue, onChange, text, isLinear }: ADSRButtonProps) {
  const classes = useStyles();
  return (
    <div className={classes.buttonContainer}>
      {/* button here */}
      {/* button text here */}
      <div className={classes.button}>
        <Knob changeInput={onChange} {...{ minVal, maxVal, initialValue, isLinear }} />
      </div>
      <p className={text === "depth" ? classes.knobTextBright : classes.knobText}>{text}</p>
    </div>
  );
}

export default function EnvelopeModule({ filterScaler, envelope }: EnvelopeProps): JSX.Element {
  const classes = useStyles();

  const changeADSR = (property: ADSRPhase) => (eventInput: number) => {
    envelope.set({ [property]: eventInput - 1 });
  };

  const changeDepth = (eventInput: number) => {
    filterScaler.set({ max: eventInput });
  };

  return (
    <div className={classes.plate} title={envelopeDescription}>
      <p className={classes.headerText}>Envelope</p>
      <div className={classes.row}>
        <div className={classNames(classes.adsrPlate, classes.row)}>
          <ADSRButton
            onChange={changeADSR("attack")}
            minVal={1}
            maxVal={4}
            initialValue={1}
            text="A"
          />
          <ADSRButton
            onChange={changeADSR("decay")}
            minVal={1}
            maxVal={3.5}
            initialValue={1.42}
            text="D"
          />
          <ADSRButton
            onChange={changeADSR("sustain")}
            minVal={1}
            maxVal={2}
            initialValue={1.5}
            text="S"
            isLinear
          />
          <ADSRButton
            onChange={changeADSR("release")}
            minVal={1}
            maxVal={6.5}
            initialValue={1.7}
            text="R"
          />
        </div>
        <div className={classNames(classes.row, classes.depthPlate)}>
          <ADSRButton
            onChange={changeDepth}
            minVal={1}
            maxVal={12001}
            initialValue={5000}
            text="depth"
            isLinear
          />
        </div>
      </div>
    </div>
  );
}
