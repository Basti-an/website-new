import { Typography } from "@material-ui/core";
import { useState, useEffect, useContext } from "react";
import { start } from "tone";

import {
  DelayModule,
  Filtermodule,
  LFOmodule,
  OSCModule,
  Ampmodule,
  EnvelopeModule,
  PatchBay,
  Oscilloscope,
  MemoryBank,
} from "./modules";

import { synthStyles } from "../../jss/synth";

import Keyboard from "../keyboard";

import { StoreContext } from "../../contexts/store";
import { LoadContext } from "../../contexts/load";
import MemoryStoreProvider from "../../contexts/MemoryProvider";

import Erebus, { Output } from "../../classes/synth/erebus";
import { loadErebusPatchValue } from "../../utils";

declare global {
  interface Window {
    erebus: Erebus;
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

function Synth(): JSX.Element {
  const classes = useStyles();

  const [oscOctaveShift, setOscOctaveShift] = useState({ one: 0, two: 1 });
  const [erebus, setErebus] = useState<Erebus | null>(null);
  const [outputs, setOutputs] = useState<Output[]>([]);

  // every time storePatch is changed, all knobs/switches/outputs save their current values to Store[storePatch]
  // after that values are persisted to localStorage
  const storePatch = useContext(StoreContext);
  const loadPatch = useContext(LoadContext);

  const { addToPatch, patchName } = storePatch;

  useEffect(() => {
    /* commit all output values to new patch (storeName) */
    if (!erebus) {
      return;
    }

    erebus.outputs.forEach((output) => {
      const { label, connectedWith } = output;
      addToPatch(
        patchName,
        `erebus-outputs-${label}-connectedWith`,
        connectedWith
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [erebus, patchName]);

  useEffect(() => {
    /* connect outputs to inputs according to values in localStorage when loadPatchName changes */
    if (loadPatch === "initial-patch") {
      return;
    }

    if (!erebus) {
      return;
    }

    // disconnect all outputs first
    erebus.outputs.forEach((output) => {
      output.output.disconnect();
    });

    const newOutputs = erebus.outputs.map((output) => {
      const { label } = output;
      const connectedWith = loadErebusPatchValue(
        loadPatch,
        `erebus-outputs-${label}-connectedWith`
      );
      if (connectedWith !== null) {
        output.connectedWith = connectedWith as number | undefined;
      } else {
        output.connectedWith = undefined;
      }
      return output;
    });

    // window.erebus.outputs = newOutputs;
    erebus.setOutputs(newOutputs);

    setOutputs(newOutputs);
    // setErebus(erebus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPatch]);

  async function initializeAudio() {
    window.erebus = new Erebus();
    await window.erebus.init();
    setErebus(window.erebus);
    setOutputs(window.erebus.outputs);
  }

  useEffect(() => {
    initializeAudio();
  }, []);

  function changeOscOctave(osc: "one" | "two", value: number) {
    oscOctaveShift[osc] = osc === "one" ? value - 1 : value;
    setOscOctaveShift(oscOctaveShift);
  }

  function sendCVs(cv1: string, cv2: string) {
    if (!erebus) {
      return;
    }

    const osc1Frequency =
      cv1.substring(0, cv1.length - 1) +
      (parseInt(cv1[cv1.length - 1], 10) + oscOctaveShift.one);
    const osc2Frequency =
      cv2.substring(0, cv2.length - 1) +
      (parseInt(cv2[cv2.length - 1], 10) + oscOctaveShift.two);

    const { keyboard, oscillators } = erebus;

    if (oscillators.osc1.glide > 0.01 || oscillators.osc2.glide > 0.01) {
      keyboard.cv1.exponentialRampTo(osc1Frequency, oscillators.osc1.glide);
      keyboard.cv2.exponentialRampTo(osc2Frequency, oscillators.osc2.glide);
    } else {
      keyboard.cv1.value = osc1Frequency;
      keyboard.cv2.value = osc2Frequency;
    }
  }

  return (
    <>
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
                <PatchBay outputs={outputs} inputs={erebus.inputs} />
              </div>
            </div>
          </div>
          <div className={classes.rowCenter}>
            <MemoryBank />
          </div>
          <div className={classes.keyboardContainer}>
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
          </div>
        </>
      )}
    </>
  );
}

export default function SynthWrapper(): JSX.Element {
  const classes = useStyles();
  const [hasClicked, setHasClicked] = useState(false);

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        id="audiocontext-trigger"
        className={classes.synth}
        onClick={async () => {
          await start();
          setHasClicked(true);
        }}
      >
        {!hasClicked && (
          <div className={classes.erebusBox} style={{ cursor: "pointer" }}>
            <Typography variant="h5" color="inherit" className={classes.title}>
              Semi-modular synthesizer based on the{" "}
              <a
                href="https://www.dreadbox-fx.com/erebus/"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.link}
              >
                Dreadbox Erebus
              </a>{" "}
            </Typography>
            <div className={classes.spacer} />
            <Typography
              variant="body1"
              color="inherit"
              className={classes.title}
            >
              &quot;This is awesome, wow!&quot; - <i>Dimitra, Dreadbox</i>
            </Typography>
            <div className={classes.spacer} />
            <Typography
              variant="body2"
              color="inherit"
              className={classes.title}
            >
              Click on this box to enable WebAudio and load the synth.
            </Typography>
          </div>
        )}
        {hasClicked && (
          <>
            <MemoryStoreProvider>
              <Synth />
            </MemoryStoreProvider>
          </>
        )}
      </div>
    </>
  );
}
