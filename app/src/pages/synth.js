import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import {
  AmplitudeEnvelope,
  FeedbackDelay,
  Filter,
  LFO,
  Master,
  OmniOscillator,
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
  synth: {},
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

function Synth() {
  const classes = useStyles();

  const [feedbackDelay, setFeedbackDelay] = useState(
    new FeedbackDelay("0.4", 0.3),
  );
  const [filter, setFilter] = useState(new Filter({ frequency: 842, Q: 2.4 }));
  const [lfo, setLfo] = useState(new LFO(5, 20, 1500));
  const [osc1, setOsc1] = useState(new OmniOscillator("C3", "sawtooth"));
  const [osc2, setOsc2] = useState(new OmniOscillator("C2", "sawtooth"));
  const [oscOctaveShift, setOscOctaveShift] = useState({ one: 0, two: 1 });
  const [sliders, setSliders] = useState({ filter: { freq: 1024, Q: 768 } });
  const [currentNote, setCurrentNote] = useState("C2");
  const [gate, setGate] = useState(false);
  const [master, setMaster] = useState(Master);
  const [ampEnv, setAmpEnv] = useState(
    new AmplitudeEnvelope({
      attack: 0.08,
      decay: 0.33,
      sustain: 0.8,
      release: 1.6,
    }),
  );
  const [velocity, setVelocity] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lfoInput, setLfoInput] = useState({});

  useEffect(() => {
    osc1.connect(filter).start();
    osc2.connect(filter).start();
    osc2.detune.value = 3;
    osc1.detune.value = -3;
  }, []);

  // add LFO to Filter
  lfo.type = "triangle";
  lfo.amplitude.value = 0.88;
  lfo.start();
  lfo.connect(filter.frequency);

  // connect modules
  // var vol = new Volume(-12);
  feedbackDelay.connect(ampEnv);
  filter.connect(feedbackDelay);
  // vol.toMaster();
  feedbackDelay.wet.value = 0.11;
  ampEnv.toMaster();

  function changeOscOctave(osc, value) {
    oscOctaveShift[osc] = value;
    setOscOctaveShift(oscOctaveShift);
  }

  useEffect(() => {
    if (osc1 !== null) {
      const osc1Frequency =
          currentNote.substring(0, currentNote.length - 1) +
          (parseInt(currentNote[currentNote.length - 1], 10) + oscOctaveShift.one);
      const osc2Frequency =
          currentNote.substring(0, currentNote.length - 1) +
          (parseInt(currentNote[currentNote.length - 1], 10) + oscOctaveShift.two);

      osc1.frequency.value = osc1Frequency;
      osc2.frequency.value = osc2Frequency;

      if (gate) {
        if (!isPlaying) {
          ampEnv.triggerAttack(0, velocity);
          setIsPlaying(true);
        }
      } else {
        ampEnv.triggerRelease();
        setIsPlaying(false);
      }
    }
  }, [osc1, osc2]);

  return (
    <div className={classes.synth}>
      <div className={classes.erebusBox}>
        <Typography variant="title" color="inherit" className={classes.title}>
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
          Sound parameters are changed by clicking and dragging on the knobs.
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
          <LFOmodule lfo={lfo} input={lfoInput} />
          <DelayModule delay={feedbackDelay} />
        </div>
        <div className="spacer">
          <OSCModule
            osc1={osc1}
            osc2={osc2}
            changeOscOctave={changeOscOctave}
          />
          <Filtermodule filter={filter} />
          <Ampmodule
            setVelocity={(value) => {
              setVelocity({ velocity: value });
            }}
            amp={ampEnv}
          />
        </div>

        <Keyboard
          sendCV={(noteValue) => {
            setCurrentNote({ currentNote: noteValue });
          }}
          sendGate={(newgate) => {
            setGate({ gate: newgate });
          }}
        />
      </div>
    </div>
  );
}

export default Synth;
