import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import Config from "../../config";
import { switchStyles } from "../../jss/synth";

const useStyles = switchStyles;

interface SwitchProps {
  onInput: (isActive: boolean) => void;
  initialState?: 0 | 1;
  name?: string;
}

const switchClick = {
  up: new Tone.Player({
    url: `${Config.hostUrl}/audio/erebus_switch_click_up.mp3`,
    volume: -18,
  }).toDestination(),
  down: new Tone.Player({
    url: `${Config.hostUrl}/audio/erebus_switch_click_down.mp3`,
    volume: -21,
  }).toDestination(),
};

export default function Switch({ onInput, initialState, name }: SwitchProps): JSX.Element {
  const [active, setActive] = useState(!!initialState || false);
  const switchEl = useRef<HTMLImageElement>(null);
  const classes = useStyles();

  useEffect(() => {
    if (switchEl.current) {
      const element = switchEl.current;
      // change view
      if (!active) {
        element.style.transform = "rotate(0deg)";
      } else {
        element.style.transform = "rotate(180deg)";
      }
    }
  }, [active]);

  useEffect(() => {
    onInput(!!active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (name) {
      const storedInitialValue = localStorage.getItem(`erebus-switches-${name}`);
      if (storedInitialValue !== null) {
        const storedBool = !!parseInt(storedInitialValue, 10);
        setActive(storedBool);
        onInput(storedBool);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const switchHandler = () => {
    // click sound
    if (active) {
      switchClick.down.start();
    } else {
      switchClick.up.start();
    }

    onInput(!active);
    setActive(!active);

    if (name) {
      // commit current value to localStorage
      localStorage.setItem(`erebus-switches-${name}`, !active ? "1" : "0");
    }
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
