import React, { useEffect, useRef, useState } from "react";
import ZingTouch from "zingtouch";
import Config from "../../config";
import { knobStyles } from "../../jss/synth";
import { getLinValue, getLogValue } from "../../utils";

const useStyles = knobStyles;

function isMobileDevice() {
  // detect mobile device
  return (
    typeof window.orientation !== "undefined" || navigator.userAgent.indexOf("IEMobile") !== -1
  );
}

interface KnobProps {
  minVal: number;
  maxVal: number;
  initialValue: number;
  isBig?: boolean;
  isLinear?: boolean;
  changeInput: (value: number) => void;
  whileSweep?: (value: number) => void;
  afterSweep?: (value: number) => void;
}

function getSliderValueForLogValue(value: number, min: number, max: number) {
  // inverse order of operations, as we map from log space to linear space
  if (min === 0) {
    min += 1;
    max += 1;
  }
  const minLog = Math.log(min);
  const maxLog = Math.log(max) - minLog;
  const valueLog = Math.log(value) - minLog;
  return (valueLog / maxLog) * 280 - 140;
}

function getSliderValueForLinValue(value: number, min: number, max: number) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return (value / max) * 280 - 140;
}

export default function Knob({
  minVal,
  maxVal,
  initialValue = 0,
  isBig,
  isLinear = false,
  changeInput,
  whileSweep,
  afterSweep,
}: KnobProps): JSX.Element {
  const [isCheckingForChange, setIsCheckingforChange] = useState(false);
  const [lastValue, setLastValue] = useState(initialValue || maxVal / 2);

  const knobEl = useRef<HTMLImageElement>(null);
  const classes = useStyles();

  function handleInputChange(value: number) {
    if (isLinear) {
      changeInput(getLinValue(value, minVal, maxVal));
      return;
    }
    changeInput(getLogValue(value, minVal, maxVal));
  }

  function executeWhileSweep() {
    if (typeof whileSweep === "function") {
      if (isLinear) {
        whileSweep(getLinValue(lastValue, minVal, maxVal));
        return;
      }
      whileSweep(getLogValue(lastValue, minVal, maxVal));
    }
  }

  function executeAfterSweep() {
    if (typeof afterSweep === "function") {
      if (isLinear) {
        afterSweep(getLinValue(lastValue, minVal, maxVal));
        return;
      }
      afterSweep(getLogValue(lastValue, minVal, maxVal));
    }
  }

  function checkForChange(currentValue: number) {
    // periodically check if knob value still changing
    // can trigger an event as soon as values not changing anymore
    setTimeout(() => {
      if (lastValue === currentValue) {
        setIsCheckingforChange(false);
        executeAfterSweep();
        return;
      }
      executeWhileSweep();
      checkForChange(lastValue);
    }, 250);
  }

  useEffect(() => {
    if (!knobEl.current) {
      console.log("oof");
      return;
    }

    if (typeof initialValue === "number") {
      changeInput(initialValue);
      if (afterSweep) {
        afterSweep(initialValue);
      }
    }

    const knob = knobEl.current;

    let currentAngle = isLinear
      ? getSliderValueForLinValue(initialValue, minVal, maxVal)
      : getSliderValueForLogValue(initialValue, minVal, maxVal);

    // init Knob position
    knob.style.transform = `rotate(${currentAngle}deg)`;

    if (isMobileDevice()) {
      const region = new ZingTouch.Region(knob);
      region.bind(knob, "rotate", (e) => {
        currentAngle += e.detail.distanceFromLast;
        if (currentAngle < 140 && currentAngle > -140) {
          knob.style.transform = `rotate(${currentAngle}deg)`;
          handleInputChange(currentAngle + 140);
          const currentValue = currentAngle + 140;
          setLastValue(currentValue);
          // check if value sweep has ended
          if (!isCheckingForChange) {
            checkForChange(currentValue);
            setIsCheckingforChange(true);
          }
        }
      });
      return;
    }

    const moveKnob = (e: MouseEvent) => {
      e.preventDefault();

      let curr = parseInt(knob.style.transform.split("(")[1].split("d").join(), 10);
      if (e.movementY < 0) {
        curr += -e.movementY;
      } else {
        curr -= e.movementY;
      }

      // do not allow knob rotation beyond 140 degrees
      if (curr < 140 && curr > -140) {
        knob.style.transform = `rotate(${curr}deg)`;
        const currentValue = curr + 140;
        handleInputChange(currentValue);
        setLastValue(currentValue);
        // check if value sweep has ended
        if (!isCheckingForChange) {
          checkForChange(currentValue);
          setIsCheckingforChange(true);
        }
      }
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

  // @TODO use image provided by my own server
  return (
    <img
      ref={knobEl}
      alt="synthesizer knob"
      className={isBig ? classes.knobBig : classes.knobSmall}
      src={`${Config.hostUrl}/images/erebus_knob.png`}
    />
  );
}
