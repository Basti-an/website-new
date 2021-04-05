import React, { useEffect, useRef, useState } from "react";
import Config from "../../config";
import { switchStyles } from "../../jss/synth";

const useStyles = switchStyles;

interface SwitchProps {
  onInput: (isActive: boolean) => void;
  initialState?: 0 | 1;
}

export default function Switch({ onInput, initialState }: SwitchProps): JSX.Element {
  const [active, setActive] = useState(initialState || false);
  const switchEl = useRef<HTMLImageElement>(null);
  const classes = useStyles();

  useEffect(() => {
    onInput(!!active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchHandler = () => {
    if (switchEl.current) {
      const element = switchEl.current;
      // change view
      if (active) {
        element.style.transform = "rotate(0deg)";
      } else {
        element.style.transform = "rotate(180deg)";
      }
    }
    onInput(!active);
    setActive(!active);
  };

  return (
    <button
      className={classes.switchButton}
      type="button"
      onClick={switchHandler}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
          switchHandler();
        }
      }}
    >
      <img
        ref={switchEl}
        alt="synthesizer switch"
        className={classes.switch}
        src={`${Config.hostUrl}/images/erebus_switch.png`}
      />
    </button>
  );
}
