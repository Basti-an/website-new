import React, { useEffect, useRef, useState } from "react";
import ZingTouch from "zingtouch";
import Config from "../../config";
import { knobStyles } from "../../jss/synth";
import {
  getIsMobileDevice,
  getLinValue,
  getLogValue,
  getSliderValueForLinValue,
  getSliderValueForLogValue,
} from "../../utils";

const useStyles = knobStyles;

interface KnobProps {
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
 */
export default function Knob({
  min,
  max,
  initial = 0,
  isBig,
  isLinear = false,
  onChange,
  whileSweep,
  afterSweep,
}: KnobProps): JSX.Element {
  const [isCheckingForChange, setIsCheckingforChange] = useState(false);
  const [lastValue, setLastValue] = useState(initial || max / 2);

  const knobEl = useRef<HTMLImageElement>(null);
  const classes = useStyles();

  function handleInputChange(value: number) {
    // takes a value between [0, 280] and remaps it to [min, max]
    onChange(isLinear ? getLinValue(value, min, max) : getLogValue(value, min, max));
  }

  function executeWhileSweep() {
    if (typeof whileSweep === "function") {
      whileSweep(isLinear ? getLinValue(lastValue, min, max) : getLogValue(lastValue, min, max));
    }
  }

  function executeAfterSweep() {
    if (typeof afterSweep === "function") {
      afterSweep(isLinear ? getLinValue(lastValue, min, max) : getLogValue(lastValue, min, max));
    }
  }

  function checkForChange(currentValue: number) {
    // periodically check if knob value still changing
    // can trigger an event as soon as values not changing anymore
    if (!whileSweep && !afterSweep) {
      return;
    }

    setTimeout(() => {
      if (lastValue === currentValue) {
        setIsCheckingforChange(false);
        executeAfterSweep();
        return;
      }

      executeWhileSweep();
      checkForChange(lastValue);
    }, 333);
  }

  function doKnobStuff(knob: HTMLImageElement, currentAngle: number) {
    // do not allow knob rotation beyond 140 degrees
    if (currentAngle > 140 || currentAngle < -140) {
      return;
    }

    knob.style.transform = `rotate(${currentAngle}deg)`;

    // normalize to [0, 280]
    const currentValue = currentAngle + 140;

    handleInputChange(currentValue);
    setLastValue(currentValue);

    // check if value sweep has ended
    if (!isCheckingForChange) {
      checkForChange(currentValue);
      setIsCheckingforChange(true);
    }
  }

  useEffect(() => {
    if (!knobEl.current) {
      return;
    }

    const knob = knobEl.current;

    let initialAngle = isLinear
      ? getSliderValueForLinValue(initial, min, max)
      : getSliderValueForLogValue(initial, min, max);

    doKnobStuff(knob, initialAngle);

    if (getIsMobileDevice()) {
      const region = new ZingTouch.Region(knob);

      region.bind(knob, "rotate", (e) => {
        initialAngle += e.detail.distanceFromLast;

        doKnobStuff(knob, initialAngle);
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
      window.addEventListener("mousemove", moveKnob);
      window.addEventListener("mouseup", () => {
        window.removeEventListener("mousemove", moveKnob);
      });
    });

    // prevent knob image dragging in firefox
    knob.addEventListener("dragstart", (e) => {
      e.preventDefault();
      return false;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <img
      ref={knobEl}
      alt="synthesizer knob"
      className={isBig ? classes.knobBig : classes.knobSmall}
      src={`${Config.hostUrl}/images/erebus_knob.png`}
    />
  );
}
