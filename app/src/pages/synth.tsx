/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import { Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import * as Tone from "tone";

import Keyboard from "../components/keyboard";
import DelayModule from "../components/synth-modules/delay";
import Filtermodule from "../components/synth-modules/filter";
import LFOmodule from "../components/synth-modules/lfo";
import OSCModule from "../components/synth-modules/osc";
import Ampmodule from "../components/synth-modules/vca";
import EnvelopeModule from "../components/synth-modules/envelope";
import PatchBay from "../components/synth-modules/patchbay";
// import Sequencer from "../components/synth-modules/sequencer";
import Oscilloscope from "../components/synth-modules/oscilloscope";
import Erebus from "../classes/synth/erebus";
import { synthStyles } from "../jss/synth";

declare global {
  interface Window {
    erebus: Erebus;
    prohibitFlowing: boolean;
    audioContext: AudioContext;
    webkitAudioContext?: AudioContext;
  }
}

const useStyles = synthStyles;

function NamePlate(): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.namePlate}>
      <h1 className={classes.namePlateTitle}>EREBUS</h1>
      <h2 className={classes.namePlateSubTitle}>DIGITAL SYNTHESIZER</h2>
    </div>
  );
}

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
    <>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={classes.synth}
        onClick={async () => {
          if (!init) {
            await Tone.start();
            initializeAudio();
            setInit(true);
          }
        }}
      >
        {!erebus && (
          <div className={classes.erebusBox}>
            <Typography variant="h5" color="inherit" className={classes.title}>
              Web-native digital implementation of the{" "}
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
              Click on this box to enable WebAudio and load the synth.
            </Typography>
          </div>
        )}
        {erebus && (
          <>
            <div className={classes.erebusBox}>
              <div className={classes.row}>
                <LFOmodule lfo={erebus.lfo} />
                <DelayModule delay={erebus.delay.delay} />
                <NamePlate />
              </div>
              <div className={classes.row}>
                <div className={classes.row}>
                  <div className={classes.column}>
                    <div className={classes.row}>
                      <OSCModule
                        oscillators={erebus.oscillators}
                        changeOscOctave={changeOscOctave}
                      />
                      <Filtermodule filter={erebus.filter} />
                      <Ampmodule
                        setAmpEnv={({ attack, release }) => {
                          if (attack) {
                            erebus.vca.ampEnv.set({ attack });
                          }
                          if (release) {
                            erebus.vca.ampEnv.set({ release });
                          }
                        }}
                      />
                    </div>
                    <div className={classes.rowVertical}>
                      <EnvelopeModule envelope={erebus.envelope} />
                      <Oscilloscope erebus={erebus} />
                    </div>
                  </div>
                  <PatchBay outputs={erebus.outputs} inputs={erebus.inputs} />
                </div>
              </div>
            </div>
            <div className={classes.rowCenter}>
              {/* <Sequencer erebus={erebus} sendCVs={sendCVs} /> */}
            </div>
            <Keyboard
              sendCVs={sendCVs}
              sendGate={(newgate) => {
                if (newgate) {
                  erebus.vca.ampEnv.triggerAttack(undefined, 1.0);
                  erebus.envelope.envelope.triggerAttack(undefined, 1.0);
                } else {
                  erebus.vca.ampEnv.triggerRelease();
                  erebus.envelope.envelope.triggerRelease();
                }
              }}
            />
          </>
        )}
      </div>
    </>
  );
}

export default Synth;
