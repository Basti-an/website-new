import React, { useContext, useEffect, useRef, useState } from "react";
import ZingTouch from "zingtouch";
import { debounce } from "lodash";

import Config from "../../../config";
import { knobStyles } from "../../../jss/synth";
import {
  getIsMobileDevice,
  getLinValue,
  getLogValue,
  getSliderValueForLinValue,
  getSliderValueForLogValue,
  loadErebusPatchValue,
  loadErebusValue,
  storeErebusValue,
} from "../../../utils";
import { StoreContext } from "../../../contexts/store";
import { LoadContext } from "../../../contexts/load";

const useStyles = knobStyles;

interface KnobProps {
  name: string;
  min: number;
  max: number;
  initial: number;
  isBig?: boolean;
  isLinear?: boolean;
  onChange: (value: number) => void;
  whileSweep?: (value: number) => void;
  afterSweep?: (value: number) => void;
}

/**
 * The Knob is an UI Element that can be rotated between -140 and 140 degrees by mouse or (multi) touch
 * whenever the rotation changes, a corresponding value will be computated which maps
 * from the linear range of [-140, 140] to [min, max], either linearly or logarithmically
 * The Knob also provides a whileSweep function, which is called with the current knob value while the knob is being moved
 * and an afterSweep function, which is called with the knobs last value, 1 second after it was moved last
 */
export default function Knob({
  name,
  min,
  max,
  initial,
  isBig = false,
  isLinear = false,
  onChange,
  whileSweep,
  afterSweep,
}: KnobProps): JSX.Element {
  const knobEl = useRef<HTMLImageElement>(null);
  const classes = useStyles();
  const storePatch = useContext(StoreContext);
  const loadPatch = useContext(LoadContext);
  const [lastValue, setLastValue] = useState<number | null>(null);

  const handleInputChange = (value: number) => {
    // takes a value between [0, 280] and remaps it to [min, max]
    const remappedValue = isLinear ? getLinValue(value, min, max) : getLogValue(value, min, max);
    onChange(remappedValue);
  };

  function executeAfterSweep(currentValue: number) {
    const value = isLinear
      ? getLinValue(currentValue, min, max)
      : getLogValue(currentValue, min, max);

    // commit last knob value to localStorage
    storeErebusValue(`erebus-knobs-${name}`, value);

    setLastValue(value);

    if (typeof afterSweep === "function") {
      afterSweep(value);
    }
  }

  function executeWhileSweep(currentValue: number) {
    if (typeof whileSweep === "function") {
      whileSweep(
        isLinear ? getLinValue(currentValue, min, max) : getLogValue(currentValue, min, max),
      );
    }
  }

  const debouncedWhileSweep = debounce(executeWhileSweep, 333);
  const debouncedAfterSweep = debounce(executeAfterSweep, 1000, { trailing: true });

  function doKnobStuff(knob: HTMLImageElement, currentAngle: number, skipAfterSweep?: boolean) {
    // do not allow knob rotation beyond 140 degrees
    if (currentAngle > 140 || currentAngle < -140) {
      return;
    }

    knob.style.transform = `rotate(${currentAngle}deg)`;

    // normalize to [0, 280]
    const currentValue = currentAngle + 140;

    handleInputChange(currentValue);

    debouncedWhileSweep(currentValue);

    if (!skipAfterSweep) {
      // on initial invocation for example, we do not want to have the side effects of the afterSweep (localStorage save),
      // therefore we provide the option of skipping invocation of the debounced afterSweep function
      debouncedAfterSweep(currentValue);
    }
  }

  useEffect(() => {
    if (!knobEl.current) {
      return;
    }
    const knob = knobEl.current;

    const localStorageValue = loadErebusValue(`erebus-knobs-${name}`);
    let initialValue = initial;
    if (localStorageValue !== null) {
      initialValue = localStorageValue as number;
    }

    const initialAngle = isLinear
      ? getSliderValueForLinValue(initialValue, min, max)
      : getSliderValueForLogValue(initialValue, min, max);

    doKnobStuff(knob, initialAngle, true);
    setLastValue(initialValue);

    if (getIsMobileDevice()) {
      const region = new ZingTouch.Region(knob);

      region.bind(knob, "rotate", (e) => {
        doKnobStuff(knob, initialAngle + e.detail.distanceFromLas);
      });
      return;
    }

    const moveKnob = (e: MouseEvent) => {
      e.preventDefault();

      let angle = parseInt(knob.style.transform.split("(")[1].split("d").join(), 10);
      angle -= e.movementY;

      doKnobStuff(knob, angle);
    };

    knob.addEventListener("mousedown", () => {
      knob.style.cursor = "grabbing";
      window.addEventListener("mousemove", moveKnob);

      window.addEventListener("mouseup", () => {
        window.removeEventListener("mousemove", moveKnob);
        knob.style.cursor = "pointer";
      });
    });

    // prevent knob image dragging in firefox
    knob.addEventListener("dragstart", (e) => {
      e.preventDefault();
      return false;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (storePatch.patchName === "initial-patch") {
      return;
    }

    if (!lastValue) {
      return;
    }

    const { addToPatch, patchName } = storePatch;
    addToPatch(patchName, `erebus-knobs-${name}`, lastValue);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storePatch.patchName]);

  useEffect(() => {
    if (loadPatch === "initial-patch") {
      return;
    }

    const knob = knobEl.current;
    if (!knob) {
      console.error("couldnt find knob el while loading patch");
      return;
    }

    const value = loadErebusPatchValue(loadPatch, `erebus-knobs-${name}`) as number;

    const angle = isLinear
      ? getSliderValueForLinValue(value, min, max)
      : getSliderValueForLogValue(value, min, max);

    doKnobStuff(knob, angle, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPatch]);

  return (
    <>
      <img
        ref={knobEl}
        alt="synthesizer knob"
        className={isBig ? classes.knobBig : classes.knobSmall}
        src={`${Config.hostUrl}/images/erebus_knob.png`}
      />
    </>
  );
}
