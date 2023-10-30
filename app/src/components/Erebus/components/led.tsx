import { sequencerStyles } from "../../../jss/synth";

const useStyles = sequencerStyles;

export function Led({ on }: { on: boolean }): JSX.Element {
  const classes = useStyles();

  return <div id="led" className={on ? classes.ledOn : classes.ledOff} />;
}
