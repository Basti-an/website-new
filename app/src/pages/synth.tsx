/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import classnames from "classnames";

import Keyboard from "../components/keyboard";
import DelayModule from "../components/synth-modules/delay";
import Filtermodule from "../components/synth-modules/filter";
import LFOmodule from "../components/synth-modules/lfo";
import OSCModule from "../components/synth-modules/osc";
import Ampmodule from "../components/synth-modules/vca";
import EnvelopeModule from "../components/synth-modules/envelope";
import Sequencer from "../components/synth-modules/sequencer";
import Config from "../config";
import Erebus from "../synth/erebus";

declare global {
  interface Window {
    erebus: Erebus;
    prohibitFlowing: boolean;
    audioContext: AudioContext;
    webkitAudioContext?: AudioContext;
  }
}

const useStyles = makeStyles({
  title: {
    color: "#fff",
    margin: "1rem auto",
  },
  synth: {
    fontSize: "1rem",
    webkitTouchCallout: "none",
    webkitUserSelect: "none",
    userSelect: "none",
  },
  link: {
    "&:visited": {
      color: "inherit",
    },
  },
  erebusBox: {
    boxSizing: "border-box",
    maxWidth: 700,
    marginLeft: "auto",
    marginRight: "auto",
    margin: "1rem 0",
    padding: "1rem",
    backgroundColor: "rgb(55, 62, 70)",
    border: "5px solid rgb(133, 225, 171)",
    borderRadius: "1rem",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08)",
  },
  wood: {
    backgroundImage: `url("${Config.hostUrl}/images/wood-texture-unsplash.jpg")`,
    backgroundSize: "cover",
  },
  error: {
    fontWeight: 500,
  },
  row: {
    "margin-right": "auto",
    "margin-left": "auto",
    display: "flex",
    "align-items": "center",
    "justify-content": "center",
    "flex-wrap": "wrap",
  },
});

interface SynthProps {
  setIsFlowing: (flowState: boolean) => void;
}

function Synth({ setIsFlowing }: SynthProps): JSX.Element {
  const classes = useStyles();
  const [oscOctaveShift, setOscOctaveShift] = useState({ one: 0, two: 1 });
  const [init, setInit] = useState(false);
  const [erebus, setErebus] = useState<Erebus | null>(null);

  useEffect(() => {
    // toggle expensive background animation off to free resources for synth
    setIsFlowing(false);
  }, [setIsFlowing]);

  async function initializeAudio() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    window.audioContext = context;

    // await context.audioWorklet.addModule(`${Config.hostUrl}/wasm/wasm-worklet-processor.js`);
    // const moogFilter = new AudioWorkletNode(context, "wasm-worklet-processor");
    window.erebus = new Erebus();
    setErebus(window.erebus);
  }

  function changeOscOctave(osc: "one" | "two", value: number) {
    oscOctaveShift[osc] = osc === "one" ? value - 1 : value;
    setOscOctaveShift(oscOctaveShift);
  }

  function sendCVs(cv1: string, cv2: string) {
    if (!erebus) {
      return;
    }

    const osc1Frequency =
      cv1.substring(0, cv1.length - 1) + (parseInt(cv1[cv1.length - 1], 10) + oscOctaveShift.one);
    const osc2Frequency =
      cv2.substring(0, cv2.length - 1) + (parseInt(cv2[cv2.length - 1], 10) + oscOctaveShift.two);

    const { oscillators } = erebus;

    if (oscillators.osc1.glide > 0.01 || oscillators.osc2.glide > 0.01) {
      oscillators.osc1.frequency.exponentialRampTo(osc1Frequency, oscillators.osc1.glide);
      oscillators.osc2.frequency.exponentialRampTo(osc2Frequency, oscillators.osc2.glide);
    } else {
      oscillators.osc1.frequency.value = osc1Frequency;
      oscillators.osc2.frequency.value = osc2Frequency;
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={classes.synth}
      onClick={async () => {
        if (!init) {
          await Tone.start();
          setInit(true);
          initializeAudio();
        }
      }}
    >
      {!erebus && (
        <div className={classes.erebusBox}>
          <Typography variant="h5" color="inherit" className={classes.title}>
            Digital rebuild of the{" "}
            <a
              href="https://www.dreadbox-fx.com/erebus/"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.link}
            >
              Dreadbox Erebus V2 Synthesizer
            </a>
          </Typography>
          <Typography variant="h5" color="inherit" className={classes.title}>
            Click on this box to enable WebAudio and load the synthesizer.
          </Typography>
        </div>
      )}
      <link href="https://fonts.googleapis.com/css?family=Comfortaa:700" rel="stylesheet" />
      {erebus && (
        <>
          <div className={classnames(classes.erebusBox, classes.wood)}>
            <div className={classes.row}>
              <LFOmodule lfo={erebus.lfo.lfo} />
              <DelayModule delay={erebus.delay.delay} />
            </div>
            <div className={classes.row}>
              <OSCModule oscillators={erebus.oscillators} changeOscOctave={changeOscOctave} />
              <Filtermodule filter={erebus.filter} />
              <Ampmodule
                setAmpEnv={({ attack, release }) => {
                  if (attack) {
                    erebus.ampEnv.set({ attack });
                  }
                  if (release) {
                    erebus.ampEnv.set({ release });
                  }
                }}
              />
            </div>
            <div className={classes.row}>
              <EnvelopeModule envelope={erebus.envelope} />
            </div>
          </div>
          <div className={classes.row}>
            <Sequencer erebus={erebus} sendCVs={sendCVs} />
          </div>
          <Keyboard
            sendCVs={sendCVs}
            sendGate={(newgate) => {
              if (newgate) {
                erebus.ampEnv.triggerAttack(undefined, 1.0);
                erebus.envelope.envelope.triggerAttack(undefined, 1.0);
              } else {
                erebus.ampEnv.triggerRelease();
                erebus.envelope.envelope.triggerRelease();
              }
            }}
          />
        </>
      )}
    </div>
  );
}

export default Synth;
