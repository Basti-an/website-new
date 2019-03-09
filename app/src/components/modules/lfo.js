import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import Knob from "../synth/knob.js";
import Switch from "../synth/switch.js";

const styles = () => ({
  plate: {
    display: "inline-flex",
    height: "100px",
    zIndex: 100,
    position: "relative",
    borderRadius: "1rem",
    marginRight: "7px",
    border: "5px solid rgb(143, 235, 181)",
    backgroundColor: "rgb(143, 235, 181)",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 2px 4px 0 rgba(0, 0, 0, 0.08)"
  },
  text: {
    width: "50%",
    textAlign: "center",
    color: "rgb(55, 62, 70)"
  },
  headertext: {
    color: "rgb(55, 62, 70)",
    textAlign: "center",
    position: "absolute",
    marginRight: "auto",
    marginLeft: "auto",
    width: "calc(100%)"
  },
  rateKnob: {
    display: "inline-flex",
    marginTop: 10
  },
  ledOff: {
    backgroundColor: "#400000",
    position: "absolute",
    width: 13,
    height: 13,
    borderRadius: "50%",
    zIndex: -1,
    border: "1px solid #000"
  },
  ledOn: {
    backgroundColor: "#F9423A",
    position: "absolute",
    width: 13,
    height: 13,
    borderRadius: "50%",
    zIndex: 0,
    opacity: 0,
    border: "1px solid #500000",
    animation: "flickerAnimation 0.2s infinite",
    boxShadow:
      "0 4px 8px 0 rgba(254, 27, 7, 0.3), 0 2px 4px 0 rgba(254, 27, 7, 0.3)"
  },
  button: {
    padding: 10
  },
  textContainer: {
    display: "flex"
  },
  ledContainer: {
    width: 20
  },
  shape: {
    padding: 5,
    backgroundColor: "rgb(55, 62, 70)",
    borderRadius: 12
  },
  switchText: {
    color: "rgb(143, 235, 181)",
    fontSize: "20px"
  }
});

// @TODO: implement CV Input to filter frequency
class LFOmodule extends Component {
  state = {};

  componentDidMount() {
    this.props.lfo.disconnect();
  }

  setAnimDuration = () => {
    // make lfo led blink according to lfo rate
    let freq = this.props.lfo.frequency.value;
    let duration = (1 / freq).toFixed(3);
    let led = this.refs.led;
    led.style.animation = `flickerAnimation ${duration}s infinite`;
  };

  afterSweep = () => {
    this.setAnimDuration();
  };

  whileSweep = () => {
    this.setAnimDuration();
  };

  evaluateConnection = value => {
    // disconnect lfo if value is below certain treshold
    if (value < 1.05) {
      let currInputValue = this.props.input && this.props.input.value;
      this.props.lfo.disconnect();
      this.props.input.value = currInputValue;
      return;
    }
    // if (typeof this.props.input.value !== "undefined") {

    // }
    this.props.lfo.connect(this.props.input);
  };

  switchWaveform = isSquare => {
    this.props.lfo.stop();
    if (isSquare) {
      this.props.lfo.type = "square";
    } else {
      this.props.lfo.type = "triangle";
    }
    this.props.lfo.start();
  };

  render() {
    const { classes, lfo } = this.props;

    return (
      <div className={classes.plate}>
        <div className={classes.headertext}>LFO</div>
        <div className={classes.components}>
          <div className={classes.rateKnob}>
            <div className={classes.button}>
              <Knob
                changeInput={value => {
                  lfo.frequency.value = value;
                }}
                minVal={0.1}
                maxVal={200}
                afterSweep={this.afterSweep}
                whileSweep={this.whileSweep}
              />
            </div>
            <div className={classes.button}>
              <Knob
                changeInput={value => {
                  lfo.amplitude.value = value - 1;
                }}
                minVal={1}
                maxVal={2}
                afterSweep={this.evaluateConnection}
                whileSweep={this.evaluateConnection}
                isLinear
                startValue={0}
              />
            </div>
          </div>
          <div className={classes.textContainer}>
            <div className={classes.text}>rate</div>
            <div className={classes.ledContainer}>
              <div className={classes.ledOff} />
              <div ref="led" className={classes.ledOn} />
            </div>
            <div className={classes.text}>depth</div>
          </div>
        </div>
        <div className={classes.shape}>
          <div className={classes.switchText}>⎍</div>
          <Switch onInput={this.switchWaveform} />
          <div className={classes.switchText}>⟁</div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(LFOmodule);
