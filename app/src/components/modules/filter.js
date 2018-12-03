import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import Knob from "../synth/knob.js";

const styles = () => ({
  plate: {
    display: "inline-block",
    height: "250px",
    width: "100px",
    zIndex: 100,
    position: "relative",
    borderRadius: "1rem",
    marginRight: "7px",
    border: "5px solid rgb(143, 235, 181)",
    backgroundColor: "rgb(55, 62, 70)",
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08)"
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
    fontSize: "14px",
    paddingTop: "35px",
    backgroundColor: "rgb(143, 235, 181)",
    color: "rgb(55, 62, 70)",
    textAlign: "center"
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
  freqKnob: {
    marginTop: "-48px"
  },
  resKnob: {
    position: "absolute",
    marginLeft: "25%",
    marginTop: "15px"
  }
});

// @TODO: implement CV Input to filter frequency
class Filtermodule extends Component {
  state = {};

  componentDidMount() {}

  render() {
    const { classes, filter } = this.props;

    return (
      <div className={classes.plate}>
        <div className={classes.topplate} />
        <div className={classes.headertext}>VCF</div>
        <div className={classes.freqKnob}>
          <Knob
            changeInput={value => {
              filter.frequency.value = value;
            }}
            minVal={20}
            maxVal={20000}
            size="big"
          />
        </div>
        <div className={classes.text}>Cutoff</div>
        <div className={classes.bottomplate}>resonance</div>
        <div className={classes.resKnob}>
          <Knob
            changeInput={value => {
              filter.Q.value = value;
            }}
            minVal={1}
            maxVal={30}
            size="small"
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Filtermodule);
