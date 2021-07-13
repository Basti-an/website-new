import classnames from "classnames";
import React from "react";
import { sequencerStyles } from "../../jss/synth";

import Knob from "./knob";

const useStyles = sequencerStyles;

export function SequencerKnob({
  onChange,
  label,
  value,
  min,
  max,
  initial,
}: {
  onChange: (input: number) => void;
  label: string;
  value: string | number;
  min: number;
  max: number;
  initial: number;
}): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classnames(classes.column, classes.padded)}>
      <p className={classes.noteTextBright}>{label}</p>
      <Knob onChange={onChange} isLinear min={min} max={max} initial={initial} />
      <p className={classes.noteTextBright}>{value}</p>
    </div>
  );
}
