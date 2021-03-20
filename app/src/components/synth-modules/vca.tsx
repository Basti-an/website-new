import React from "react";
import Knob from "../synth/knob";

import { vcaStyles } from "../../jss/synth";

const useStyles = vcaStyles;

interface VcaProps {
  setVelocity: (value: number) => void;
  setAmpEnv: (ampEnvOptions: { attack?: number; release?: number }) => void;
}

export default function Ampmodule({ setVelocity, setAmpEnv }: VcaProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.plate}>
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
          maxVal={900}
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
            initialValue={7}
          />
        </div>
        <div className={classes.knobRelease}>
          <Knob
            changeInput={(value: number) => {
              setAmpEnv({ release: value });
            }}
            minVal={0.05}
            maxVal={7}
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
