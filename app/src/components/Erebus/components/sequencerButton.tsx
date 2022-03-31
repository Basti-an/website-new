import React from "react";
import { sequencerStyles } from "../../../jss/synth";

const useStyles = sequencerStyles;

export function SequencerButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children?: React.ReactNode;
}): JSX.Element {
  const classes = useStyles();

  return (
    <button className={classes.sequencerButton} type="button" {...{ onClick }}>
      {children}
    </button>
  );
}
