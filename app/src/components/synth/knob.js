import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import ZingTouch from "zingtouch";
import Config from "../../config";

const styles = () => ({
  knobBig: {
    height: "85px",
    transform: "rotate(0deg)",
    marginRight: "auto",
    marginLeft: "auto",
    display: "block",
  },
  knobSmall: {
    height: "50px",
    transform: "rotate(0deg)",
    marginRight: "auto",
    marginLeft: "auto",
    display: "block",
  },
});

function isMobileDevice() {
  // detect mobile device
  return (
    typeof window.orientation !== "undefined" || navigator.userAgent.indexOf("IEMobile") !== -1
  );
}

class Knob extends Component {
  state = {
    isCheckingforChange: false,
    lastValue: this.props.minVal,
  };

  componentDidMount() {
    const { knob } = this.refs;
    // use ZingTouch on mobile for knob rotation
    // TODO: check for "sweep" in ZingTouch
    const { startValue } = this.props;
    let currentAngle = startValue - 140 || 0;

    if (isMobileDevice()) {
      const region = new ZingTouch.Region(knob);
      region.bind(knob, "rotate", (e) => {
        currentAngle += e.detail.distanceFromLast;
        if (currentAngle < 140 && currentAngle > -140) {
          knob.style.transform = `rotate(${currentAngle}deg)`;
          this.handleInputChange(currentAngle + 140);
        }
      });
      return;
    }
    // init Knob position
    knob.style.transform = `rotate(${currentAngle}deg)`;

    const moveKnob = (e) => {
      e.preventDefault();

      let curr = parseInt(knob.style.transform.split("(")[1].split("d"), 10);
      if (e.movementY < 0) {
        curr += -e.movementY;
      } else {
        curr -= e.movementY;
      }

      // do not allow knob rotation beyond 140 degrees
      if (curr < 140 && curr > -140) {
        knob.style.transform = `rotate(${curr}deg)`;
        const currentValue = curr + 140;
        this.handleInputChange(currentValue);
        this.setState({ lastValue: currentValue });
        // check if value sweep has ended
        if (!this.state.isCheckingForChange) {
          this.checkForChange(currentValue);
          this.setState({ isCheckingForChange: true });
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
  }

  checkForChange = (currentValue) => {
    // periodically check if knob value still changing
    // can trigger an event as soon as values not changing anymore
    console.log("sweep started.");
    setTimeout(() => {
      if (this.state.lastValue === currentValue) {
        console.log("sweep ended.");
        console.log("value:", this.state.lastValue);
        this.setState({ isCheckingForChange: false });
        this.afterSweep();
        return;
      }
      this.whileSweep();
      this.checkForChange(this.state.lastValue);
    }, 250);
  };

  handleInputChange = (value) => {
    const { minVal, maxVal, changeInput, isLinear } = this.props;
    if (isLinear) {
      changeInput(this.getLinValue(value, minVal, maxVal));
      return;
    }
    changeInput(this.getLogValue(value, minVal, maxVal));
  };

  whileSweep = () => {
    const { minVal, maxVal, whileSweep, isLinear } = this.props;
    const { lastValue } = this.state;
    if (typeof whileSweep === "function") {
      if (isLinear) {
        whileSweep(this.getLinValue(lastValue, minVal, maxVal));
        return;
      }
      whileSweep(this.getLogValue(lastValue, minVal, maxVal));
    }
  };

  afterSweep = () => {
    const { minVal, maxVal, afterSweep, isLinear } = this.props;
    const { lastValue } = this.state;
    if (typeof afterSweep === "function") {
      if (isLinear) {
        afterSweep(this.getLinValue(lastValue, minVal, maxVal));
        return;
      }
      afterSweep(this.getLogValue(lastValue, minVal, maxVal));
    }
  };

  getLogValue(sliderValue, min, max) {
    const minp = 0;
    const maxp = 280;

    const minv = Math.log(min);
    const maxv = Math.log(max);

    // calculate adjustment factor
    const scale = (maxv - minv) / (maxp - minp);
    return Math.exp(minv + scale * (sliderValue - minp));
  }

  getLinValue(sliderValue, min, max) {
    const maxp = 280;
    const linVal = sliderValue / maxp;
    const range = max - min;
    const inRangeVal = linVal * range;
    return min + inRangeVal;
  }

  render() {
    const { classes, isBig } = this.props;

    // @TODO use image provided by my own server
    return (
      <img
        ref="knob"
        alt="synthesizer knob"
        className={isBig ? classes.knobBig : classes.knobSmall}
        src={`${Config.hostUrl}/images/erebus_knob.png`}
      />
    );
  }
}
export default withStyles(styles)(Knob);
