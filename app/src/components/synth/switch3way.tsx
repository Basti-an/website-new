import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import Config from "../../config";
import { switchStyles } from "../../jss/synth";

const useStyles = switchStyles;

export declare type Ternary = -1 | 0 | 1;

interface SwitchProps {
  onInput: (state: Ternary) => void;
  initialState?: Ternary;
}

const switchClick = {
  up: new Tone.Player({
    url: `${Config.hostUrl}/audio/erebus_switch_click_up.mp3`,
    volume: -15,
  }).toDestination(),
  up2: new Tone.Player({
    url: `${Config.hostUrl}/audio/erebus_switch_click_up2.mp3`,
    volume: -18,
  }).toDestination(),
  down: new Tone.Player({
    url: `${Config.hostUrl}/audio/erebus_switch_click_down.mp3`,
    volume: -21,
  }).toDestination(),
  down2: new Tone.Player({
    url: `${Config.hostUrl}/audio/erebus_switch_click_down2.mp3`,
    volume: -18,
  }).toDestination(),
};

export default function ThreeWaySwitch({ onInput, initialState }: SwitchProps): JSX.Element {
  const [state, setState] = useState<Ternary>(initialState || -1);
  const [prevState, setPrevState] = useState<Ternary>(initialState || -1);
  const switchEl = useRef<HTMLImageElement>(null);
  const classes = useStyles();

  useEffect(() => {
    onInput(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onInput(state);
  }, [state, onInput]);

  const switchHandler = () => {
    if (state === 1) {
      setState(0);
      setPrevState(1);
      switchClick.down.start();
    }
    if (state === -1) {
      setState(0);
      setPrevState(-1);
      switchClick.up.start();
    }
    if (state === 0) {
      if (prevState === 1) {
        setState(-1);
        switchClick.down2.start();
      }
      if (prevState === -1) {
        setState(1);
        switchClick.up2.start();
      }
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
      {state === 0 && (
        <img
          ref={switchEl}
          alt="synthesizer switch"
          className={classes.switch}
          src={`${Config.hostUrl}/images/erebus_switch_neutral.png`}
        />
      )}
      {state === -1 && (
        <img
          ref={switchEl}
          alt="synthesizer switch"
          className={classes.switch}
          src={`${Config.hostUrl}/images/erebus_switch.png`}
        />
      )}
      {state === 1 && (
        <img
          style={{ transform: "rotate(180deg)" }}
          ref={switchEl}
          alt="synthesizer switch"
          className={classes.switch}
          src={`${Config.hostUrl}/images/erebus_switch.png`}
        />
      )}
    </button>
  );
}