/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import * as Tone from "tone";

import Keyboard from "../components/keyboard";
import DelayModule from "../components/synth-modules/delay";
import Filtermodule from "../components/synth-modules/filter";
import LFOmodule from "../components/synth-modules/lfo";
import OSCModule from "../components/synth-modules/osc";
import Ampmodule from "../components/synth-modules/vca";

/* @TODO:
  refactor everything, clean everything up
  implement routing for lfo
  implement adsr instead of ar
  osc controls
  octave up, down buttons
  implement paraphony for oscillators
*/

declare global {
  interface Window {
    erebus: Erebus;
  }
}

const useStyles = makeStyles({
  title: {
    color: "#fff",
    margin: "1rem auto",
  },
  synth: {
    fontSize: "1rem",
  },
  link: {
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
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08)",
  },
  error: {
    fontWeight: 500,
  },
});

interface AudioOptions {
  filter?: Tone.AutoFilterOptions & { Q?: number }; // q ("resonance") is not part of AutoFilterOptions unfortunately
  lfo?: Tone.LFOOptions;
}

interface Erebus {
  filter: Tone.Filter;
  lfo: Tone.LFO;
  osc1: Tone.OmniOscillator<Tone.Oscillator>;
  osc2: Tone.OmniOscillator<Tone.Oscillator>;
  ampEnv: Tone.AmplitudeEnvelope;
  feedbackDelay: Tone.FeedbackDelay;
  noise: Tone.Noise;
  add: Tone.Add;
}

function initAudio(options: AudioOptions = {}): Erebus {
  // @TODO add defaults everywhere
  const filterOpt = options.filter;
  const filter = new Tone.Filter({
    frequency: filterOpt?.frequency ?? 0,
    Q: filterOpt?.Q || 2.4,
  });

  const lfoOpt = options.lfo;
  const lfo = new Tone.LFO(lfoOpt?.frequency ?? 0.7, lfoOpt?.min ?? 0, lfoOpt?.max ?? 1000);
  // const merge = Tone.Merge()
  lfo.set({ units: "hertz" });
  const add = new Tone.Add(2);
  lfo.connect(add);
  lfo.start();
  add.connect(filter.frequency);
  const osc1 = new Tone.OmniOscillator("C2", "sawtooth");
  const osc2 = new Tone.OmniOscillator("C2", "sawtooth");
  // create noise floor at -62Db, which is the noise floor of my personal Dreadbox Erebus serial no. 777
  const noise = new Tone.Noise("white");
  noise.volume.value = -63;

  const ampEnv = new Tone.AmplitudeEnvelope({
    attack: 0.42,
    // attackCurve:"exponential",
    decay: 0.33,
    sustain: 1.0,
    release: 0.5,
  });

  const feedbackDelay = new Tone.FeedbackDelay("0.4", 0.3);
  const outNode = new Tone.Gain(0.9);
  const limiter = new Tone.Limiter(-12);

  // connect modules
  // ampEnv.toDestination();
  const distortion = new Tone.Distortion(0.05);
  distortion.connect(feedbackDelay);

  // detune oscillators slightly
  osc2.detune.value = 8;
  osc1.detune.value = -3;

  // start oscillatros and sum them into one audio node, connecting mixer out to filter
  osc1.connect(limiter).start();
  osc2.connect(limiter).start();
  noise.connect(limiter).start();
  limiter.connect(filter);
  // distortion.connect();

  filter.connect(ampEnv);
  ampEnv.connect(feedbackDelay);
  feedbackDelay.connect(outNode);
  outNode.toDestination();

  // limiter.connect(Tone.Destination); // feedbackDelay
  return {
    filter,
    lfo,
    osc1,
    osc2,
    ampEnv,
    feedbackDelay,
    noise,
    add,
  };
}

interface SynthProps {
  setIsFlowing: (flowState: boolean) => void;
}

function Synth({ setIsFlowing }: SynthProps): JSX.Element {
  const classes = useStyles();
  const [oscOctaveShift, setOscOctaveShift] = useState({ one: 0, two: 1 });
  const [velocity, setVelocity] = useState(0.2);
  // const [isPlaying, setIsPlaying] = useState(false);
  const [init, setInit] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIsFlowing(false);
  }, [setIsFlowing]);

  useEffect(() => {
    if (init) {
      window.erebus = initAudio();
      setReady(true);
    }
  }, [init]);

  function changeOscOctave(osc: "one" | "two", value: number) {
    oscOctaveShift[osc] = value;
    setOscOctaveShift(oscOctaveShift);
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={classes.synth}
      onClick={() => {
        if (!init) {
          setInit(true);
        }
      }}
    >
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
        </Typography>
        <Typography variant="h5" color="inherit" className={classes.title}>
          Click anywhere on this box to enable audio and load the synthesizer.
        </Typography>
        <Typography variant="h5" color="inherit" className={classes.title}>
          How to play: Sounds can be played by clicking on the keyboard or by pressing keys on your
          keyboard (a-k for white keys, w-z for black keys).
        </Typography>
        <Typography variant="h5" color="inherit" className={classes.title}>
          Sound parameters are changed by clicking and dragging on the knobs.
        </Typography>
        <Typography className={classes.error} variant="h5" color="error">
          Currently Not Working on Mobile! This is a work in progress
        </Typography>
      </div>
      <link href="https://fonts.googleapis.com/css?family=Comfortaa:700" rel="stylesheet" />
      {ready && (
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
                setAmpEnv={({ attack, release }) => {
                  if (attack) {
                    window.erebus.ampEnv.set({ attack });
                  }
                  if (release) {
                    window.erebus.ampEnv.set({ release });
                  }
                }}
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
      )}
    </div>
  );
}

export default Synth;
