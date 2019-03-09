import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import Knob from "../synth/knob.js";
import Switch from "../synth/switch.js";
const styles = () => ({
  plate: {
    display: "inline-block",
    height: 240,
    position: "relative",
    borderRadius: "1rem",
    marginRight: "7px",
    border: "5px solid rgb(143, 235, 181)",
    backgroundColor: "rgb(143, 235, 181)",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 2px 4px 0 rgba(0, 0, 0, 0.08)"
  },
  text: {
    width: "33%",
    textAlign: "center",
    color: "rgb(55, 62, 70)"
  },
  inlineText: {
    display: "inline-block"
  },
  switches: {},

  headertext: {
    color: "rgb(55, 62, 70)",
    textAlign: "center",
    position: "absolute",
    marginRight: "auto",
    marginLeft: "auto",
    width: "calc(100%)"
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
    padding: 10,
    display: "inline-flex"
  },
  textContainer: {
    display: "flex"
  },
  ledContainer: {
    width: 20
  }
});

// @TODO: implement CV Input to filter frequency
class OSCModule extends Component {
  state = {
    currentNote: "C2"
  };

  componentDidMount() {}

  render() {
    const { classes, osc1, osc2 } = this.props;
    const { currentNote } = this.state;

    return (
      <div className={classes.plate}>
        <div className={classes.headertext}>OSC</div>
        <div className={classes.TuneKnobs}>
          <div className={classes.button}>
            <Knob
              changeInput={value => {
                osc1.detune.value = value - 500;
                osc2.detune.value = value - 500;
              }}
              isBig
              isLinear
              minVal={0}
              maxVal={1000}
              startValue={140}
            />
          </div>
          <div className={classes.button}>
            <Knob
              changeInput={value => {
                osc2.detune.value = value - 100;
              }}
              isBig
              isLinear
              minVal={0}
              maxVal={200}
              startValue={140}
            />
          </div>
        </div>
        <div className={classes.switches}>
          <div className={classes.inlineText}>8 16</div>
          <Switch
            className={classes.switch}
            onInput={active => {
              if (active) {
                this.props.changeOscOctave("one", 0);
              } else {
                this.props.changeOscOctave("one", -1);
              }
            }}
          />

          <Switch
            className={classes.switch}
            onInput={active => {
              if (active) {
                this.props.changeOscOctave("two", 1);
              } else {
                this.props.changeOscOctave("two", 0);
              }
            }}
          />
          <div className={classes.inlineText}>4 8</div>
        </div>
        <div className={classes.textContainer} />
      </div>
    );
  }
}

export default withStyles(styles)(OSCModule);
