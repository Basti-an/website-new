import classnames from "classnames";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import Config from "../../../config";
import { LoadContext } from "../../../contexts/load";
import { StoreContext } from "../../../contexts/store";
import { switchStyles } from "../../../jss/synth";
import { loadErebusPatchValue, loadErebusValue } from "../../../utils";

const useStyles = switchStyles;

export declare type Ternary = -1 | 0 | 1;

interface SwitchProps {
  onInput: (state: Ternary) => void;
  initialState?: Ternary;
  name?: string;
}

const switchClick = {
  up: new Tone.Player({
    url: `${Config.hostUrl}/audio/erebus_switch_click_up.mp3`,
    volume: -18,
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
    volume: -21,
  }).toDestination(),
};

export default function ThreeWaySwitch({ onInput, initialState, name }: SwitchProps): JSX.Element {
  const [state, setState] = useState<Ternary>(initialState ?? -1);
  const [prevState, setPrevState] = useState<Ternary>(initialState ?? -1);
  const switchEl = useRef<HTMLImageElement>(null);
  const classes = useStyles();

  const storePatch = useContext(StoreContext);
  const loadPatch = useContext(LoadContext);

  useEffect(() => {
    onInput(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onInput(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, onInput]);

  useEffect(() => {
    if (name) {
      const storedInitialValue = loadErebusValue(`erebus-switches-${name}`);
      if (storedInitialValue !== null) {
        const storedTernary = storedInitialValue as Ternary;
        setState(storedTernary);
        onInput(storedTernary);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const switchHandler = () => {
    let newState = 0;

    if (state === 1) {
      setPrevState(1);
      switchClick.down.start();
    }

    if (state === -1) {
      setPrevState(-1);
      switchClick.up.start();
    }

    if (state === 0) {
      if (prevState === 1) {
        newState = -1;
        switchClick.down2.start();
      }
      if (prevState <= 0) {
        newState = 1;
        switchClick.up2.start();
      }
    }

    setState(newState as Ternary);
    if (name) {
      localStorage.setItem(`erebus-switches-${name}`, newState.toString());
    }
  };

  useEffect(() => {
    const value = loadErebusPatchValue(loadPatch, `erebus-switches-${name}`);
    if (value === null) {
      return;
    }

    setState(value as Ternary);
    onInput(value as Ternary);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPatch]);

  const { addToPatch, patchName } = storePatch;
  useEffect(() => {
    addToPatch(patchName, `erebus-switches-${name}`, state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patchName]);

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
        className={classnames(classes.switch, state !== 0 && classes.hide)}
        src={`${Config.hostUrl}/images/erebus_switch_neutral.png`}
      />
      <img
        style={state === 1 ? { transform: "rotate(180deg)" } : {}}
        ref={switchEl}
        alt="synthesizer switch"
        className={classnames(classes.switch, state === 0 && classes.hide)}
        src={`${Config.hostUrl}/images/erebus_switch.png`}
      />
    </button>
  );
}
