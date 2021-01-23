import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import Knob from "../synth/_knob.js";

const styles = () => ({
  plate: {
    display: "inline-block",
    height: "100px",
    zIndex: 100,
    position: "relative",
    borderRadius: "1rem",
    marginRight: "7px",
    border: "5px solid rgb(143, 235, 181)",
    backgroundColor: "rgb(143, 235, 181)",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 2px 4px 0 rgba(0, 0, 0, 0.08)",
  },
  text: {
    width: "33%",
    textAlign: "center",
    color: "rgb(55, 62, 70)",
  },
  headertext: {
    color: "rgb(55, 62, 70)",
    textAlign: "center",
    position: "absolute",
    marginRight: "auto",
    marginLeft: "auto",
    width: "calc(100%)",
  },
  rateKnob: {
    display: "inline-flex",
    marginTop: 10,
  },
  ledOff: {
    backgroundColor: "#400000",
    position: "absolute",
    width: 13,
    height: 13,
    borderRadius: "50%",
    zIndex: -1,
    border: "1px solid #000",
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
    boxShadow: "0 4px 8px 0 rgba(254, 27, 7, 0.3), 0 2px 4px 0 rgba(254, 27, 7, 0.3)",
  },
  button: {
    padding: 10,
  },
  textContainer: {
    display: "flex",
  },
  ledContainer: {
    width: 20,
  },
});

// @TODO: implement CV Input to filter frequency
class DelayModule extends Component {
  state = {};

  componentDidMount() {}

  render() {
    const { classes, delay } = this.props;

    return (
      <div className={classes.plate}>
        <div className={classes.headertext}>Echo</div>
        <div className={classes.rateKnob}>
          <div className={classes.button}>
            <Knob
              changeInput={(value) => {
                delay.delayTime.value = value;
              }}
              minVal={0.01}
              maxVal={0.99}
              startValue={60}
            />
          </div>
          <div className={classes.button}>
            <Knob
              changeInput={(value) => {
                delay.feedback.value = value;
              }}
              minVal={0.01}
              maxVal={1.0}
              afterSweep={this.evaluateConnection}
              whileSweep={this.evaluateConnection}
              isLinear
              startValue={115}
            />
          </div>
          <div className={classes.button}>
            <Knob
              changeInput={(value) => {
                delay.wet.value = value;
              }}
              minVal={0.01}
              maxVal={0.99}
              afterSweep={this.evaluateConnection}
              whileSweep={this.evaluateConnection}
              isLinear
              startValue={30}
            />
          </div>
        </div>
        <div className={classes.textContainer}>
          <div className={classes.text}>time</div>
          <div className={classes.text}>feed</div>
          <div className={classes.text}>mix</div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(DelayModule);
