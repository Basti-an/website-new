import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import Knob from "../synth/knob.js";

const styles = () => ({
  plate: {
    height: "250px",
    display: "inline-block",
    width: "140px",
    zIndex: 100,
    position: "relative",
    borderRadius: "1rem",
    backgroundColor: "rgb(55, 62, 70)",
    border: "5px solid rgb(143, 235, 181)"
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
    padding: "25px",
    paddingRight: "5px",
    paddingLeft: "5px",
    paddingTop: "35px",
    backgroundColor: "rgb(143, 235, 181)",
    color: "rgb(55, 62, 70)",
    textAlign: "center",
    fontSize: "14px"
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
  headertext: {
    color: "rgb(55, 62, 70)",
    textAlign: "center",
    position: "absolute",
    top: "10px",
    marginRight: "auto",
    marginLeft: "auto",
    width: "calc(100%)"
  },
  headertext: {
    color: "rgb(55, 62, 70)",
    textAlign: "center",
    position: "absolute",
    top: "10px",
    marginRight: "auto",
    marginLeft: "auto",
    width: "calc(100%)"
  }
});

class Ampmodule extends Component {
  state = {};

  componentDidMount() {}

  render() {
    const { classes, amp, master } = this.props;
    return (
      <div className={classes.plate}>
        <div className={classes.topplate} />
        <div className={classes.headertext}>VCA</div>
        <Knob
          changeInput={value => {
            console.log(value / 1000);
            master.volume.value = value / 1000;
            amp.sustain = value / 1000;
          }}
          minVal={1}
          maxVal={1000}
          size="big"
        />
        <div className={classes.text}>Level</div>
        <Knob
          changeInput={value => {
            amp.attack = value / 1000;
          }}
          minVal={5}
          maxVal={10000}
        />
        <Knob
          changeInput={value => {
            amp.release = value / 1000;
          }}
          minVal={100}
          maxVal={100000}
        />
        <div className={classes.bottomplate}>
          attack &nbsp;&nbsp;&nbsp; release
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Ampmodule);
