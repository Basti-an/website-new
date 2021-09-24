import React, { useContext, useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import Config from "../../config";
import { LoadContext } from "../../contexts/load";
import { StoreContext } from "../../contexts/store";
import { switchStyles } from "../../jss/synth";
import { loadErebusPatchValue, loadErebusValue, storeErebusValue } from "../../utils";

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
  const storePatch = useContext(StoreContext);
  const loadPatch = useContext(LoadContext);

  useEffect(() => {
    if (switchEl.current) {
      const element = switchEl.current;

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
      const storedBool = loadErebusValue(`erebus-switches-${name}`);
      if (storedBool === null) {
        return;
      }
      setActive(storedBool as boolean);
      onInput(storedBool as boolean);
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
      storeErebusValue(`erebus-switches-${name}`, !active);
    }
  };

  useEffect(() => {
    if (storePatch.patchName === "inital-patch") {
      return;
    }

    const { addToPatch, patchName } = storePatch;
    addToPatch(patchName, `erebus-switches-${name}`, active);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storePatch.patchName]);

  useEffect(() => {
    if (loadPatch === "inital-patch") {
      return;
    }

    const value = loadErebusPatchValue(loadPatch, `erebus-switches-${name}`);
    if (value === null) {
      return;
    }

    setActive(value as boolean);
    onInput(value as boolean);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPatch]);

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
