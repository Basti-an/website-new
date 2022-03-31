import React from "react";
import Knob from "../components/knob";

import { vcaStyles } from "../../../jss/synth";

const useStyles = vcaStyles;

interface VcaProps {
  setAmpEnv: (ampEnvOptions: { attack?: number; release?: number }) => void;
}

const vcaDescription =
  "The VCA is the amplifier, determining the loudness of the output signal. This one has a ramp up time, called attack and a release time, " +
  "which determines how long the sound will still play after the key was released.";

export default function Ampmodule({ setAmpEnv }: VcaProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.plate} title={vcaDescription}>
      <div className={classes.topplate} />
      <div className={classes.headertext}>VCA</div>
      <div className={classes.knobLevel}>
        <Knob
          onChange={(value: number) => {
            window.erebus.vca.output.gain.rampTo(value / 1000, 0);
          }}
          min={1}
          max={400}
          initial={150}
          isBig
          isLinear
          name="vca-output"
        />
      </div>
      <div className={classes.text}>Level</div>
      <div className={classes.knobContainer}>
        <div className={classes.knobAttack}>
          <Knob
            onChange={(value: number) => {
              setAmpEnv({ attack: value });
            }}
            min={0.01}
            max={3}
            initial={0.01}
            name="vca-attack"
          />
        </div>
        <div className={classes.knobRelease}>
          <Knob
            onChange={(value: number) => {
              setAmpEnv({ release: value });
            }}
            min={0.1}
            max={6}
            initial={0.42}
            name="vca-release"
          />
        </div>
      </div>
      <div className={classes.bottomplate}>
        <div className={classes.textContainer}>
          <div className={classes.textBottom}>attack</div>
          <div className={classes.textBottom}>release</div>
        </div>
      </div>
    </div>
  );
}
