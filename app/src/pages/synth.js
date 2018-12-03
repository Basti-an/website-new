import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import {
  AmplitudeEnvelope,
  FeedbackDelay,
  Filter,
  Master,
  OmniOscillator,
  Volume
} from "tone";
import Keyboard from "../components/keyboard.js";
import Filtermodule from "../components/modules/filter.js";
/* @TODO: refactor componentDidMount
      implement paraphony for oscillators
*/

const styles = () => ({
  title: {
    marginRight: "auto",
    marginLeft: "auto"
  },
  synth: {}
});

class Synth extends Component {
  state = {
    filter: new Filter(800),
    osc1: null,
    osc2: null,
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
      attack: 0.04,
      decay: 0.0,
      sustain: 0.9,
      release: 1.3
    })
  };

  componentDidMount() {
    // create oscillators
    let osc1 = new OmniOscillator("C3", "sawtooth")
        .connect(this.state.filter)
        .start(),
      osc2 = new OmniOscillator("C2", "sawtooth")
        .connect(this.state.filter)
        .start();
    osc2.detune.value = 5;
    osc1.detune.value = -5;

    // set filter
    let filter = this.state.filter;
    filter.Q.value = 2;

    // set Amplitude Envelope
    var ampEnv = this.state.ampEnv;

    // connect modules
    var vol = new Volume(-12);
    filter.connect(ampEnv);
    var feedbackDelay = new FeedbackDelay("0.4", 0.3).connect(vol);
    vol.toMaster();
    feedbackDelay.wet.value = 0.05;
    ampEnv.connect(feedbackDelay);
    this.setState({ osc1, osc2, filter, ampEnv });
  }

  render() {
    const { classes } = this.props;
    const { currentNote, osc1, osc2, gate, ampEnv } = this.state;
    if (osc1 !== null) {
      osc1.frequency.value = currentNote.replace("2", "3"); // play note 1 octave higher
      osc2.frequency.value = currentNote;

      if (gate) {
        ampEnv.triggerAttack();
      } else {
        ampEnv.triggerRelease();
      }
    }

    return (
      <div className={classes.synth}>
        <Typography variant="title" color="inherit" className={classes.title}>
          Dreadbox Erebus Clone
        </Typography>
        <Typography
          variant="subheading"
          color="inherit"
          className={classes.title}
        >
          Currently Not Working on Mobile!
        </Typography>
        <Typography
          variant="subheading"
          color="inherit"
          className={classes.title}
        >
          To date I implemented 2 basic oscillators, playing Sawtooth waves and
          a 2-pole filter routed through a delay.
        </Typography>
        <Typography
          variant="subheading"
          color="inherit"
          className={classes.title}
        >
          You can fiddle around with the filter by clicking and dragging on the
          knobs and play the keys either by clicking on them or by pressing the
          keys a-k, with the keys w-u corresponding to black keys.
        </Typography>
        <link
          href="https://fonts.googleapis.com/css?family=Comfortaa:700"
          rel="stylesheet"
        />
        <div className="spacer">
          <Filtermodule filter={this.state.filter} />
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
    );
  }
}

export default withStyles(styles)(Synth);
