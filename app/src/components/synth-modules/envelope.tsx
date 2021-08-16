import classNames from "classnames";
import React from "react";
import { envelopeStyles } from "../../jss/synth";
import Envelope from "../../synth/envelope";

import Knob from "../synth/knob";

const useStyles = envelopeStyles;

interface EnvelopeProps {
  envelope: Envelope;
}

interface ADSRButtonProps {
  min: number;
  max: number;
  initial: number;
  onChange: (input: number) => void;
  text: string;
  isLinear?: boolean;
}

type ADSRPhase = "attack" | "decay" | "sustain" | "release";

const envelopeDescription =
  "The envelope gets triggered every time a note is played and consists of four phases - attack, decay, sustain, release. Hit up ADSR on wikipedia to learn more";

function ADSRButton({ min, max, initial, onChange, text, isLinear }: ADSRButtonProps) {
  const classes = useStyles();
  return (
    <div className={classes.buttonContainer}>
      {/* button here */}
      {/* button text here */}
      <div className={classes.button}>
        <Knob onChange={onChange} {...{ min, max, initial, isLinear }} />
      </div>
      <p className={text === "depth" ? classes.knobTextBright : classes.knobText}>{text}</p>
    </div>
  );
}

export default function EnvelopeModule({ envelope }: EnvelopeProps): JSX.Element {
  const classes = useStyles();

  const changeADSR = (property: ADSRPhase) => (eventInput: number) => {
    envelope.envelope.set({ [property]: eventInput - 1 });
  };

  const changeDepth = (eventInput: number) => {
    envelope.setMaxOutput(eventInput);
  };

  return (
    <div className={classes.plate} title={envelopeDescription}>
      <p className={classes.headerText}>Envelope</p>
      <div className={classes.row}>
        <div className={classNames(classes.adsrPlate, classes.row)}>
          <ADSRButton onChange={changeADSR("attack")} min={1} max={4} initial={1} text="A" />
          <ADSRButton onChange={changeADSR("decay")} min={1} max={3.5} initial={1.42} text="D" />
          <ADSRButton
            onChange={changeADSR("sustain")}
            min={1}
            max={2}
            initial={1.5}
            text="S"
            isLinear
          />
          <ADSRButton onChange={changeADSR("release")} min={1} max={6.5} initial={1.7} text="R" />
        </div>
        <div className={classNames(classes.row, classes.depthPlate)}>
          <ADSRButton onChange={changeDepth} min={0} max={1} initial={0.4} text="depth" isLinear />
        </div>
      </div>
    </div>
  );
}
