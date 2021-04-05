import React from "react";
import Knob from "../synth/knob";

import { vcaStyles } from "../../jss/synth";

const useStyles = vcaStyles;

interface VcaProps {
  setVelocity: (value: number) => void;
  setAmpEnv: (ampEnvOptions: { attack?: number; release?: number }) => void;
}

const vcaDescription =
  "The VCA is the amplifier, determining the loudness of the output signal. This one has a ramp up time (attack, currently not working unfortunately) and a release, " +
  "which determines how long the sound will still play after the key was released.";

export default function Ampmodule({ setVelocity, setAmpEnv }: VcaProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.plate} title={vcaDescription}>
      <div className={classes.topplate} />
      <div className={classes.headertext}>VCA</div>
      <div className={classes.knobLevel}>
        <Knob
          changeInput={(value: number) => {
            console.log(value / 1000);
            // master.volume.value = value / 1000;
            setVelocity(value / 1000);
          }}
          minVal={1}
          maxVal={300}
          initialValue={80}
          isBig
          isLinear
        />
      </div>
      <div className={classes.text}>Level</div>
      <div className={classes.knobContainer}>
        <div className={classes.knobAttack}>
          <Knob
            changeInput={(value: number) => {
              setAmpEnv({ attack: value });
            }}
            minVal={0.05}
            maxVal={2}
            initialValue={0.5}
            isLinear
          />
        </div>
        <div className={classes.knobRelease}>
          <Knob
            changeInput={(value: number) => {
              setAmpEnv({ release: value });
            }}
            minVal={1}
            maxVal={9}
            initialValue={6}
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
