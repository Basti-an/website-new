import React from "react";
import classnames from "classnames";
import { OmniOscillatorType } from "tone/build/esm/source/oscillator/OscillatorInterface";
import Knob from "../synth/knob";
import Config from "../../config";
import { oscStyles } from "../../jss/synth";
import { IOscillators } from "../../interfaces/oscillators";
import ThreeWaySwitch, { Ternary } from "../synth/switch3way";

const useStyles = oscStyles;

interface OscProps {
  oscillators: IOscillators;
  changeOscOctave: (osc: "one" | "two", octave: number) => void;
}

const oscDescription =
  "These oscillators create the sound that is shaped by the other components, you can change the tuning, octave, waveform and glide time between notes of each oscillator";

function OscillatorKnob({
  headerText,
  subText,
  onChangeInput,
  initialValue = 500,
}: {
  headerText: string;
  subText: string;
  onChangeInput: (value: number) => void;
  initialValue?: number;
}): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.osc}>
      <p className={classes.headertext}>{headerText}</p>
      <div className={classes.smallButton}>
        <Knob
          changeInput={onChangeInput}
          isBig
          isLinear
          minVal={0}
          maxVal={1000}
          initialValue={initialValue}
        />
      </div>
      <p className={classes.brightText}>{subText}</p>
    </div>
  );
}

function OctaveSwitch({
  onToggle,
  octaves,
  placement,
}: {
  onToggle: (state: Ternary) => void;
  octaves: string[];
  placement: "left" | "right";
}): JSX.Element {
  const classes = useStyles();
  return (
    <div
      style={placement === "left" ? { marginLeft: -10 } : { marginRight: -10 }}
      className={classes.switchContainer}
    >
      <div className={classes.justifyMid}>
        {placement === "right" && (
          <div className={classes.switchRight}>
            <ThreeWaySwitch onInput={onToggle} initialState={-1} />
          </div>
        )}
        <div className={classes.octaves}>
          {octaves.map((octave) => (
            <span
              className={classnames(
                placement === "left" ? classes.octaveTextLeft : classes.octaveTextRight,
                classes.brightText,
              )}
            >
              {octave}
            </span>
          ))}
        </div>
        {placement === "left" && (
          <div className={classes.switchLeft}>
            <ThreeWaySwitch onInput={onToggle} initialState={0} />
          </div>
        )}
      </div>
    </div>
  );
}

function WaveformSwitch({
  oscillators,
  position,
}: {
  oscillators: IOscillators;
  position: "left" | "right";
}): JSX.Element {
  const classes = useStyles();
  const waveforms: Record<string, string> = {
    pulse: "waveform_square_dark.png",
    triangle: "waveform_triangle_dark.png",
    sine: "∿",
    sawtooth: "waveform_saw_dark.png",
  };
  const osc = position === "left" ? oscillators.osc1 : oscillators.osc2;

  const changeOscWaveform = (state: Ternary) => {
    if (state === 0) {
      osc.oscillator.stop();
    } else if (state === 1) {
      osc.oscillator.type = osc.possibleWaveforms[0] as OmniOscillatorType;
      osc.oscillator.start();
    } else {
      osc.oscillator.type = osc.possibleWaveforms[1] as OmniOscillatorType;
      osc.oscillator.start();
    }
  };

  return (
    <div
      className={classes.waveform}
      style={position === "left" ? { marginLeft: -20 } : { marginRight: -20, marginLeft: 3 }}
    >
      <div className={classes.row}>
        {position === "left" && (
          <p className={classnames(classes.nomargin, classes.miniText)}>OFF</p>
        )}
        <div className={classes.column}>
          <img
            className={classes.waveformLabel}
            src={`${Config.hostUrl}/images/${waveforms[osc.possibleWaveforms[0]]}`}
            alt="waveform"
          />
          <ThreeWaySwitch onInput={changeOscWaveform} initialState={position === "left" ? -1 : 1} />
          <img
            className={classes.waveformLabel}
            src={`${Config.hostUrl}/images/${waveforms[osc.possibleWaveforms[1]]}`}
            alt="waveform"
          />
        </div>
        {position === "right" && (
          <p className={classnames(classes.nomargin, classes.miniText)}>OFF</p>
        )}
      </div>
    </div>
  );
}

export default function OSCModule({ oscillators, changeOscOctave }: OscProps): JSX.Element {
  const classes = useStyles();

  function changeOsc1Frequency(value: number) {
    const { osc1, osc2 } = oscillators;
    osc1.oscillator.detune.value = value - 500;
    osc2.oscillator.detune.value = value - 500 - osc2.detune;
  }

  function changeOsc2Frequency(value: number) {
    const { osc1, osc2 } = oscillators;
    osc2.detune = value - 500;
    const frequencyOsc1 = osc1.oscillator.detune.value;

    osc2.oscillator.detune.value = frequencyOsc1 - osc2.detune;
  }

  const toggleOscOctave = (oscillator: "one" | "two") => (state: Ternary) => {
    console.log("test");
    if (state === 1) {
      changeOscOctave(oscillator, 2);
    } else if (state === 0) {
      changeOscOctave(oscillator, 1);
    } else {
      changeOscOctave(oscillator, 0);
    }
    window.erebus.ampEnv.triggerRelease();
    window.erebus.ampEnv.triggerAttack(0.1, 1.0);
  };

  return (
    <div className={classes.plate} title={oscDescription}>
      <div className={classes.mixPanel}>
        <div className={classes.smallButton}>
          <Knob
            changeInput={(value: number) => {
              oscillators.setOscMix(value);
            }}
            isLinear
            minVal={0}
            maxVal={100}
            initialValue={50}
          />
        </div>
        <p className={classes.darkText}>Mix</p>
      </div>

      <div className={classes.tuneKnobs}>
        <div className={classes.leftOsc}>
          <OscillatorKnob headerText="OSC 1" subText="tune" onChangeInput={changeOsc1Frequency} />

          <OctaveSwitch
            onToggle={toggleOscOctave("one")}
            octaves={["8", "16", "32"]}
            placement="left"
          />
        </div>
        <div className={classes.rightOsc}>
          <OctaveSwitch
            onToggle={toggleOscOctave("two")}
            octaves={["4", "8", "16"]}
            placement="right"
          />

          <OscillatorKnob
            headerText="OSC 2"
            subText="detune"
            onChangeInput={changeOsc2Frequency}
            initialValue={510}
          />
        </div>
      </div>

      <div className={classes.glideSection}>
        <div className={classes.glideLeft}>
          <div className={classes.glideButton}>
            <div className={classes.smallButton}>
              <Knob
                changeInput={(value: number) => {
                  oscillators.osc1.glide = value - 1;
                }}
                minVal={1}
                maxVal={2}
                initialValue={1}
              />
            </div>
            <p className={classes.darkText}>glide</p>
          </div>
          <WaveformSwitch oscillators={oscillators} position="left" />
        </div>

        <div className={classes.glideRight}>
          <WaveformSwitch oscillators={oscillators} position="right" />
          <div className={classes.glideButton} style={{ float: "right" }}>
            <div className={classes.smallButton}>
              <Knob
                changeInput={(value: number) => {
                  oscillators.osc2.glide = value - 1;
                }}
                minVal={1}
                maxVal={2}
                initialValue={1}
              />
            </div>
            <p className={classes.darkText}>glide</p>
          </div>
        </div>
      </div>
    </div>
  );
}
