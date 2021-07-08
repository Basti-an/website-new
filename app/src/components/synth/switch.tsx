import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import Config from "../../config";
import { switchStyles } from "../../jss/synth";

const useStyles = switchStyles;

interface SwitchProps {
  onInput: (isActive: boolean) => void;
  initialState?: 0 | 1;
}

const switchClick = {
  up: new Tone.Player({
    url: `${Config.hostUrl}/audio/erebus_switch_click_up.mp3`,
    volume: -15,
    playbackRate: 0.75,
  }).toDestination(),
  up2: new Tone.Player({
    url: `${Config.hostUrl}/audio/erebus_switch_click_up2.mp3`,
    volume: -18,
    playbackRate: 0.75,
  }).toDestination(),
  down: new Tone.Player({
    url: `${Config.hostUrl}/audio/erebus_switch_click_down.mp3`,
    volume: -21,
    playbackRate: 0.75,
  }).toDestination(),
  down2: new Tone.Player({
    url: `${Config.hostUrl}/audio/erebus_switch_click_down2.mp3`,
    volume: -18,
    playbackRate: 0.75,
  }).toDestination(),
};

export default function Switch({ onInput, initialState }: SwitchProps): JSX.Element {
  const [active, setActive] = useState(initialState || false);
  const switchEl = useRef<HTMLImageElement>(null);
  const classes = useStyles();

  useEffect(() => {
    onInput(!!active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchHandler = () => {
    // click sound
    if (switchEl.current) {
      const element = switchEl.current;
      // change view
      if (active) {
        element.style.transform = "rotate(0deg)";
        // click sound
        switchClick.down.start();
      } else {
        element.style.transform = "rotate(180deg)";
        switchClick.up.start();
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
