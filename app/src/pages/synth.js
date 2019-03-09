import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import {
  AmplitudeEnvelope,
  FeedbackDelay,
  Filter,
  LFO,
  Master,
  OmniOscillator
} from "tone";
import Keyboard from "../components/keyboard.js";
import DelayModule from "../components/modules/delay.js";
import Filtermodule from "../components/modules/filter.js";
import LFOmodule from "../components/modules/lfo.js";
import OSCModule from "../components/modules/osc.js";
import Ampmodule from "../components/modules/vca.js";
/* @TODO: refactor componentDidMount
      implement paraphony for oscillators
*/

const styles = () => ({
  title: {
    color: "#fff",
    margin: "1rem auto"
  },
  synth: {},
  erebusBox: {
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 800,
    margin: "1rem",
    padding: "1rem",
    backgroundColor: "rgb(55, 62, 70)",
    border: "5px solid rgb(143, 235, 181)",
    borderRadius: "1rem",
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08)"
  },
  error: {
    fontWeight: 500
  }
});

class Synth extends Component {
  state = {
    feedbackDelay: new FeedbackDelay("0.4", 0.3),
    filter: new Filter(800),
    lfo: new LFO(5, 20, 1500),
    osc1: null,
    osc2: null,
    oscOctaveShift: { one: 0, two: 1 },
    sliders: {
      filter: {
        freq: 1024,
        Q: 768
      }
    },
    currentNote: "C2",
    gate: false,
    master: Master,
    ampEnv: new AmplitudeEnvelope({
      attack: 0.1,
      decay: 0.2,
      sustain: 0.7,
      release: 1.3
    }),
    velocity: 0.5,
    isPlaying: false,
    lfoInput: {}
  };

  componentDidMount() {
    // create oscillators
    let osc1 = new OmniOscillator("C3", "sawtooth")
        .connect(this.state.filter)
        .start(),
      osc2 = new OmniOscillator("C2", "sawtooth")
        .connect(this.state.filter)
        .start();
    osc2.detune.value = 3;
    osc1.detune.value = -3;

    let { filter, feedbackDelay } = this.state;
    // set filter
    filter.Q.value = 2;

    // add LFO to Filter
    this.state.lfo.type = "triangle";
    this.state.lfo.amplitude.value = 0.0;
    this.state.lfo.start();
    // this.state.lfo.connect(this.state.filter.frequency);

    // set Amplitude Envelope
    var ampEnv = this.state.ampEnv;

    // connect modules
    // var vol = new Volume(-12);
    feedbackDelay.connect(ampEnv);
    filter.connect(feedbackDelay);
    // vol.toMaster();
    feedbackDelay.wet.value = 0.05;
    ampEnv.toMaster();
    this.setState({ osc1, osc2, filter, ampEnv, lfoInput: filter.frequency });
  }

  changeOscOctave = (osc, value) => {
    let { oscOctaveShift } = this.state;
    oscOctaveShift[osc] = value;
    this.setState(oscOctaveShift);
  };

  render() {
    const { classes } = this.props;
    const {
      currentNote,
      osc1,
      osc2,
      gate,
      ampEnv,
      isPlaying,
      oscOctaveShift
    } = this.state;
    if (osc1 !== null) {
      let osc1Frequency =
          currentNote.substring(0, currentNote.length - 1) +
          (parseInt(currentNote[currentNote.length - 1]) + oscOctaveShift.one),
        osc2Frequency =
          currentNote.substring(0, currentNote.length - 1) +
          (parseInt(currentNote[currentNote.length - 1]) + oscOctaveShift.two);

      console.log(osc1);
      osc1.frequency.value = osc1Frequency;
      osc2.frequency.value = osc2Frequency;

      if (gate) {
        if (!isPlaying) {
          ampEnv.triggerAttack(0, this.state.velocity);
          this.state.isPlaying = true;
        }
      } else {
        ampEnv.triggerRelease();
        this.state.isPlaying = false;
      }
    }

    return (
      <div className={classes.synth}>
        <div className={classes.erebusBox}>
          <Typography variant="title" color="inherit" className={classes.title}>
            Dreadbox Erebus Clone (Work in progress)
          </Typography>
          <Typography
            className={classes.error}
            variant="subheading"
            color="error"
          >
            Currently Not Working on Mobile! Implementation is buggy at the
            moment.
          </Typography>
          <Typography
            variant="subheading"
            color="inherit"
            className={classes.title}
          >
            Oscillator controls and styling, Envelope generator and modular
            patching yet to be implemented.
          </Typography>
          <Typography
            variant="subheading"
            color="inherit"
            className={classes.title}
          >
            Sound parameter are changed by clicking and dragging on the knobs.
          </Typography>
          <Typography
            variant="subheading"
            color="inherit"
            className={classes.title}
          >
            Sounds can be played by clicking on the keyboard or by pressing keys
            on your keyboard (a-k for white keys, w-z for black keys).
          </Typography>
        </div>
        <link
          href="https://fonts.googleapis.com/css?family=Comfortaa:700"
          rel="stylesheet"
        />
        <div style={{ minWidth: 510 }} className={classes.erebusBox}>
          <div className="spacer">
            <LFOmodule lfo={this.state.lfo} input={this.state.lfoInput} />
            <DelayModule delay={this.state.feedbackDelay} />
          </div>
          <div className="spacer">
            <OSCModule
              osc1={this.state.osc1}
              osc2={this.state.osc2}
              changeOscOctave={this.changeOscOctave}
            />
            <Filtermodule filter={this.state.filter} />
            <Ampmodule
              setVelocity={value => {
                this.setState({ velocity: value });
              }}
              amp={this.state.ampEnv}
            />
          </div>

          <Keyboard
            sendCV={noteValue => {
              this.setState({ currentNote: noteValue });
            }}
            sendGate={gate => {
              this.setState({ gate });
            }}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Synth);
