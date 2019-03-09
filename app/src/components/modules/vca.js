import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import Knob from "../synth/knob.js";

const styles = () => ({
  plate: {
    height: 240,
    display: "inline-block",
    width: 140,
    zIndex: 100,
    position: "relative",
    borderRadius: "1rem",
    backgroundColor: "rgb(55, 62, 70)",
    border: "5px solid rgb(143, 235, 181)",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 2px 4px 0 rgba(0, 0, 0, 0.08)"
  },
  topplate: {
    zIndex: 0,
    height: 0,
    width: 0,
    borderLeft: "50px solid transparent",
    borderRight: "50px solid transparent",
    borderTop: "80px solid rgb(143, 235, 181)",
    marginRight: "auto",
    marginLeft: "auto"
  },
  bottomplate: {
    zIndex: 0,
    position: "absolute",
    bottom: 0,
    height: "10px",
    width: "calc(100% - 10px)",
    paddingBottom: 15,
    paddingRight: 5,
    paddingLeft: 5,
    paddingTop: 35,
    backgroundColor: "rgb(143, 235, 181)",
    color: "rgb(55, 62, 70)",
    textAlign: "center"
  },
  attack: {
    position: "absolute",
    left: "10px",
    bottom: "40px",
    zIndex: 1000,
    height: "50px",
    display: "block"
  },
  release: {
    position: "absolute",
    bottom: "40px",
    zIndex: 1000,
    height: "50px",
    right: "10px",
    display: "block"
  },
  text: {
    marginTop: "5px",
    textAlign: "center",
    color: "rgb(143, 235, 181)"
  },
  textBottom: {
    width: "50%",
    textAlign: "center",
    color: "rgb(55, 62, 70)"
  },
  textContainer: {
    display: "flex"
  },
  headertext: {
    color: "rgb(55, 62, 70)",
    textAlign: "center",
    position: "absolute",
    top: "10px",
    marginRight: "auto",
    marginLeft: "auto",
    width: "calc(100%)"
  },
  knobLevel: {
    marginTop: -47
  },
  knobAttack: {
    zIndex: 1000,
    display: "inline-block",
    padding: 10,
    position: "relative"
  },
  knobRelease: {
    zIndex: 1000,
    display: "inline-block",
    padding: 10,
    position: "relative"
  },
  knobContainer: {
    marginTop: 6
  }
});

class Ampmodule extends Component {
  state = {};

  componentDidMount() {}

  render() {
    const { classes, amp, setVelocity, setAmp } = this.props;
    return (
      <div className={classes.plate}>
        <div className={classes.topplate} />
        <div className={classes.headertext}>VCA</div>
        <div className={classes.knobLevel}>
          <Knob
            changeInput={value => {
              console.log(value / 1000);
              //master.volume.value = value / 1000;
              setVelocity(value / 1000);
            }}
            minVal={1}
            maxVal={900}
            isBig
            isLinear
          />
        </div>
        <div className={classes.text}>Level</div>
        <div className={classes.knobContainer}>
          <div className={classes.knobAttack}>
            <Knob
              changeInput={value => {
                amp.attack = value / 5000;
                console.log(amp.attack);
              }}
              minVal={100}
              maxVal={100000}
              startValue={0}
            />
          </div>
          <div className={classes.knobRelease}>
            <Knob
              changeInput={value => {
                amp.release = value / 5000;
                console.log(amp.release);
              }}
              minVal={100}
              maxVal={100000}
              isLinear
            />
          </div>
        </div>
        <div className={classes.bottomplate}>
          <div className={classes.textContainer}>
            <div className={classes.textBottom}>attack</div>
            <div className={classes.textBottom}>release</div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Ampmodule);
