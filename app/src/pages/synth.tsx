/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import * as Tone from "tone";

import { getLogRemapped } from "../utils";

import Keyboard from "../components/keyboard";
import DelayModule from "../components/synth-modules/delay";
import Filtermodule from "../components/synth-modules/filter";
import LFOmodule from "../components/synth-modules/lfo";
import OSCModule from "../components/synth-modules/osc";
import Ampmodule from "../components/synth-modules/vca";
import { IOscillators } from "../interfaces/oscillators";
import { IErebus } from "../interfaces/erebus";
import { IFilter } from "../interfaces/filter";
import { ModSource } from "../types/modSource.d";

declare global {
  interface Window {
    erebus: IErebus;
    prohibitFlowing: boolean;
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

function createOscillators(): IOscillators {
  const osc1 = new Tone.OmniOscillator("C1", "sawtooth");
  const osc2 = new Tone.OmniOscillator("C2", "sawtooth");

  // combined output of both oscillators
  const oscMixOut = new Tone.Limiter(-12);

  // we want to control the frequency by knob while being able to
  // simultaniously modulate the frequency from another component
  // in order to do that, we create an add node to mix 2 signals together (knob + mod)
  const osc1FreqConnect = new Tone.Add();
  const osc2FreqConnect = new Tone.Add();
  const osc1Freq = new Tone.Signal(0, "frequency");
  const osc2Freq = new Tone.Signal(0, "frequency");
  osc1Freq.connect(osc1FreqConnect.addend);
  osc2Freq.connect(osc2FreqConnect.addend);
  osc1FreqConnect.connect(osc1.frequency);
  osc2FreqConnect.connect(osc2.frequency);

  // start oscillators and sum them into one audio node, connecting mixer out to filter
  const osc1Volume = new Tone.Volume(-15);
  const osc2Volume = new Tone.Volume(-15);
  osc1.connect(osc1Volume).start();
  osc2.connect(osc2Volume).start();
  osc1Volume.connect(oscMixOut);
  osc2Volume.connect(oscMixOut);

  // helper function to translate linear values 0-100 to natural log between min-max
  function getLogValue(sliderValue: number, min: number, max: number): number {
    return getLogRemapped(sliderValue, min, max, 0, 100);
  }

  function setOscMix(input: number): void {
    // translate input between 0-100 into decibel mix of 2 oscillators,
    // where 0 translates to osc1 at 100% & osc2 at 0 and
    // 100 translates to osc1 at 0% & osc2 at 100% volumes
    const percentageOsc1 = 100 - input;
    const percentageOsc2 = input;
    const decibelsOsc1 =
      percentageOsc1 < 1 ? -Infinity : getLogValue(100 - percentageOsc1, 12, 24) * -1;
    const decibelsOsc2 =
      percentageOsc2 < 1 ? -Infinity : getLogValue(100 - percentageOsc2, 12, 24) * -1;

    osc1Volume.set({ volume: decibelsOsc1 });
    osc2Volume.set({ volume: decibelsOsc2 });
  }

  return {
    osc1: {
      oscillator: osc1,
      volume: osc1Volume,
      glide: 0,
      waveform: osc1.type,
      possibleWaveforms: ["sawtooth", "pulse"],
      frequency: osc1Freq,
    },
    osc2: {
      oscillator: osc2,
      volume: osc2Volume,
      glide: 0,
      waveform: osc2.type,
      possibleWaveforms: ["sawtooth", "triangle"],
      frequency: osc2Freq,
      detune: 0,
    },
    oscMixOut,
    setOscMix,
    inputs: {
      freqOsc1: (input: ModSource) => input.connect(osc1FreqConnect),
      freqOsc2: (input: ModSource) => input.connect(osc2FreqConnect),
    },
  };
}

function createFilter(options: AudioOptions = {}): IFilter {
  const filterOpt = options.filter;
  const filter12db = new Tone.Filter({
    frequency: filterOpt?.frequency ?? 0,
    Q: filterOpt?.Q || 2.4,
  });

  // setup filter to accept a modulation source
  const filterConnect = new Tone.Add();
  const filterFreq = new Tone.Signal(0, "frequency");
  filterFreq.connect(filterConnect.addend);
  filterConnect.connect(filter12db.frequency);

  return {
    filter: filter12db,
    frequency: filterFreq,
    inputs: {
      frequency: (input: ModSource) => input.connect(filter12db.detune),
    },
  };
}

function initAudio(options: AudioOptions = {}): IErebus {
  // create filter
  const filter = createFilter(options);

  // create lfo
  const lfoOpt = options.lfo;
  const lfo = new Tone.LFO(lfoOpt?.frequency ?? 0.7, lfoOpt?.min ?? -1200, lfoOpt?.max ?? 1200);
  lfo.set({ units: "number" });
  lfo.start();

  // connect lfo to filter frequency
  filter.inputs.frequency(lfo);

  // create oscillators
  const oscillators = createOscillators();

  // OSC´s audio -> filter
  oscillators.oscMixOut.connect(filter.filter);

  // create noise floor similar to my personal Dreadbox Erebus serial no. 777
  const noise = new Tone.Noise("white");
  noise.volume.value = -60;
  noise.connect(filter.filter).start();

  // create Amplitude Envelope
  const ampEnv = new Tone.AmplitudeEnvelope({
    attack: 0.42,
    decay: 0.33,
    sustain: 1.0,
    release: 0.5,
  });

  const feedbackDelay = new Tone.FeedbackDelay("0.4", 0.3);
  const output = new Tone.Gain(0.9);

  const distortion = new Tone.Distortion(0.05);
  distortion.connect(feedbackDelay);

  // Filter audio -> Amplitude Envelope
  filter.filter.connect(ampEnv);
  ampEnv.connect(feedbackDelay);

  feedbackDelay.connect(output);
  output.toDestination();

  // limiter.connect(Tone.Destination); // feedbackDelay
  return {
    filter,
    lfo,
    ampEnv,
    feedbackDelay,
    noise,
    lfoConnect: filter.inputs.frequency,
    output,
    oscillators,
  };
}

interface SynthProps {
  setIsFlowing: (flowState: boolean) => void;
}

function Synth({ setIsFlowing }: SynthProps): JSX.Element {
  const classes = useStyles();
  const [oscOctaveShift, setOscOctaveShift] = useState({ one: 0, two: 1 });
  const [init, setInit] = useState(false);
  const [erebus, setErebus] = useState<IErebus | null>(null);

  useEffect(() => {
    setIsFlowing(false);
  }, [setIsFlowing]);

  useEffect(() => {
    if (init) {
      window.erebus = initAudio();
      setErebus(window.erebus);
    }
  }, [init]);

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
      oscillators.osc1.frequency.rampTo(osc1Frequency, oscillators.osc1.glide);
      oscillators.osc2.frequency.rampTo(osc2Frequency, oscillators.osc2.glide);
    } else {
      oscillators.osc1.frequency.value = osc1Frequency;
      oscillators.osc2.frequency.value = osc2Frequency;
    }
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
          Click on this box to enable WebAudio and load the synthesizer.
        </Typography>

        <Typography className={classes.error} variant="h5" color="error">
          This is a work in progress and currently Not Working on Mobile
        </Typography>
      </div>
      <link href="https://fonts.googleapis.com/css?family=Comfortaa:700" rel="stylesheet" />
      {erebus && (
        <>
          <div style={{ minWidth: 510 }} className={classes.erebusBox}>
            <div className="spacer">
              <LFOmodule lfo={erebus.lfo} />
              <DelayModule delay={erebus.feedbackDelay} />
            </div>
            <div className="spacer">
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
          </div>
          <Keyboard
            sendCVs={sendCVs}
            sendGate={(newgate) => {
              if (newgate) {
                erebus.ampEnv.triggerAttack(undefined, 1.0);
              } else {
                erebus.ampEnv.triggerRelease();
              }
            }}
          />
        </>
      )}
    </div>
  );
}

export default Synth;
