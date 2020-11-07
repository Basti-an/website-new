import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import {
  AmplitudeEnvelope,
  FeedbackDelay,
  Filter,
  LFO,
  OmniOscillator,
  Destination,
  Distortion,
  Noise,
} from "tone";

import Keyboard from "../components/keyboard";
import DelayModule from "../components/modules/delay";
import Filtermodule from "../components/modules/filter";
import LFOmodule from "../components/modules/lfo";
import OSCModule from "../components/modules/osc";
import Ampmodule from "../components/modules/vca";
/* @TODO:
  refactor everything, clean everything up
  implement routing for lfo
  implement adsr instead of ar
  osc controls
  octave up, down buttons
  implement paraphony for oscillators
*/

const useStyles = makeStyles({
  title: {
    color: "#fff",
    margin: "1rem auto",
  },
  synth: {
    fontSize: "1rem",
  },
  link: {
    textDecoration: "none",
    "&:visited": {
      color: "inherit",
    },
  },
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
      "0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08)",
  },
  error: {
    fontWeight: 500,
  },
});

function initAudio(options = {}) {
  // @TODO add defaults everywhere
  const filterOpt = options.filter || {};
  const filter = new Filter({ frequency: filterOpt.frequency || 842, Q: filterOpt.Q || 2.4 });

  const lfoOpt = options.lfo || {};
  const lfo = new LFO(lfoOpt.frequency || 5, lfoOpt.min || 20, lfoOpt.max || 1500);

  const osc1 = new OmniOscillator("C2", "sawtooth");
  const osc2 = new OmniOscillator("C2", "sawtooth");
  // create noise floor at -44Db
  const noise = new Noise("white");
  noise.volume.value = -44;

  const ampEnv = new AmplitudeEnvelope({
    attack: 0.42,
    decay: 0.33,
    sustain: 0.8,
    release: 0.5,
  });
  ampEnv.attackCurve = "exponential";

  const feedbackDelay = new FeedbackDelay("0.4", 0.3).toDestination();

  // connect modules
  // ampEnv.toDestination();
  feedbackDelay.wet.value = 0.11;
  const distortion = new Distortion(0.03);

  // detune oscillators slightly
  osc2.detune.value = 8;
  osc1.detune.value = -3;

  osc1.connect(filter).start();
  osc2.connect(filter).start();
  noise.connect(filter).start();
  filter.connect(ampEnv);
  ampEnv.connect(feedbackDelay);
  feedbackDelay.chain(distortion, Destination);
  return {
    filter, lfo, osc1, osc2, ampEnv, feedbackDelay, noise,
  };
}

function Synth() {
  const classes = useStyles();

  const [oscOctaveShift, setOscOctaveShift] = useState({ one: 0, two: 1 });
  const [velocity, setVelocity] = useState(0.4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [init, setInit] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (init) {
      window.erebus = initAudio();
      setReady(true);
    }
  }, [init]);

  function changeOscOctave(osc, value) {
    oscOctaveShift[osc] = value;
    setOscOctaveShift(oscOctaveShift);
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className={classes.synth} onClick={() => { if (!init) { setInit(true); } }}>
      <div className={classes.erebusBox}>
        <Typography variant="h5" color="inherit" className={classes.title}>
          <a
            href="https://www.dreadbox-fx.com/erebus/"
            target="_blank"
            rel="noopener noreferrer"
            className={classes.link}
          >
            Dreadbox Erebus Clone
          </a>{" "}
          (Work in progress)
        </Typography>
        <Typography
          className={classes.error}
          variant="h5"
          color="error"
        >
          Currently Not Working on Mobile! Implementation is buggy at the
          moment.
        </Typography>
        <Typography
          variant="h5"
          color="inherit"
          className={classes.title}
        >
          Oscillator controls and styling, Envelope generator and modular
          patching yet to be implemented.
        </Typography>
        <Typography
          variant="h5"
          color="inherit"
          className={classes.title}
        >
          Sound parameters are changed by clicking and dragging on the knobs.
        </Typography>
        <Typography
          variant="h5"
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
      {
        ready &&
        <>
          <div style={{ minWidth: 510 }} className={classes.erebusBox}>
            <div className="spacer">
              <LFOmodule lfo={window.erebus.lfo} input={window.erebus.filter} />

              <DelayModule delay={window.erebus.feedbackDelay} />
            </div>
            <div className="spacer">
              <OSCModule
                osc1={window.erebus.osc1}
                osc2={window.erebus.osc2}
                changeOscOctave={changeOscOctave}
              />
              <Filtermodule filter={window.erebus.filter} />
              <Ampmodule
                setVelocity={(value) => {
                  setVelocity(value);
                }}
                amp={window.erebus.ampEnv}
              />
            </div>

          </div>
          <Keyboard
            sendCVs={(cv1, cv2) => {
              const osc1Frequency =
                cv1.substring(0, cv1.length - 1) +
                (parseInt(cv1[cv1.length - 1], 10) + oscOctaveShift.one);
              const osc2Frequency =
                cv2.substring(0, cv2.length - 1) +
                (parseInt(cv2[cv2.length - 1], 10) + oscOctaveShift.two);

              window.erebus.osc1.frequency.value = osc1Frequency;
              window.erebus.osc2.frequency.value = osc2Frequency;
            }}
            sendGate={(newgate) => {
              if (newgate) {
                // if (!isPlaying) {
                window.erebus.ampEnv.triggerAttack(0.05, velocity);
                // setIsPlaying(true);
                // }
              } else {
                window.erebus.ampEnv.triggerRelease();
                // setIsPlaying(false);
              }
            }}
          />
        </>
      }
    </div>
  );
}

export default Synth;
