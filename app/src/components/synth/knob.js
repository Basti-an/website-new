import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";

// TODO: change between zingtouch and my implementation based on device
const styles = () => ({
  knobBig: {
    height: "85px",
    transform: "rotate(0deg)",
    marginRight: "auto",
    marginLeft: "auto",
    display: "block"
  },
  knobSmall: {
    height: "50px",
    transform: "rotate(0deg)",
    marginRight: "auto",
    marginLeft: "auto",
    display: "block"
  }
});

class Knob extends Component {
  state = {};

  componentDidMount() {
    const { startValue } = this.props;
    let knob = this.refs.knob;
    let currentAngle = startValue || 0;
    knob.style.transform = "rotate(" + currentAngle + "deg)";
    // @TODO: use this on mobile
    // var region = new ZingTouch.Region(knob);

    const moveKnob = e => {
      e.preventDefault();
      let curr;
      if (e.movementY < 0) {
        curr = parseInt(knob.style.transform.split("(")[1].split("d"), 10);
        curr += -e.movementY;
      } else {
        curr = parseInt(knob.style.transform.split("(")[1].split("d"), 10);
        curr -= e.movementY;
      }
      if (curr < 140 && curr > -140) {
        knob.style.transform = "rotate(" + curr + "deg)";
        this.handleInputChange(curr + 140);
      }
    };

    knob.addEventListener("mousedown", () => {
      window.addEventListener("mousemove", moveKnob);
      window.addEventListener("mouseup", () => {
        window.removeEventListener("mousemove", moveKnob);
      });
    });

    /* @TODO: use this on mobile
    region.bind(knob, "rotate", e => {
      currentAngle += e.detail.distanceFromLast;
      console.log(currentAngle);
      if (currentAngle < 140 && currentAngle > -140) {
        knob.style.transform = "rotate(" + currentAngle + "deg)";
        this.handleInputChange(currentAngle + 140);
      }
    });
    */
  }

  handleInputChange = value => {
    const { minVal, maxVal, changeInput } = this.props;
    changeInput(this.getLogValue(value, minVal, maxVal));
  };

  getLogValue(sliderValue, min, max) {
    var minp = 0;
    var maxp = 280;

    var minv = Math.log(min);
    var maxv = Math.log(max);

    // calculate adjustment factor
    var scale = (maxv - minv) / (maxp - minp);
    return Math.exp(minv + scale * (sliderValue - minp));
  }

  render() {
    const { classes, size } = this.props;

    // @TODO use image provided by my own server
    return (
      <img
        ref="knob"
        alt="synthesizer knob"
        className={size === "big" ? classes.knobBig : classes.knobSmall}
        src="https://image.ibb.co/mu0J2q/erebus-knob.png"
      />
    );
  }
}
export default withStyles(styles)(Knob);
