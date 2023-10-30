import classnames from "classnames";
import { useEffect, useState } from "react";
import * as Tone from "tone";
import { sequencerStyles } from "../../../jss/synth";
import Erebus from "../../../classes/synth/erebus";
import { allSequencerNotes } from "../../../utils";

import Knob from "../components/knob";
import { Led } from "../components/led";
import { SequencerButton } from "../components/sequencerButton";
import { SequencerKnob } from "../components/sequencerKnob";

const useStyles = sequencerStyles;

const sequencerDescription = "";

// @TODO: implement sequencer stuff in window and state to decouple trigger function from react rerenders

const defaultSequence = [
  // bass sequence for Giorgio Moroders "chase"
  "A#2",
  "C3",
  "C3",
  "C3",
  "A#2",
  "C3",
  "D#3",
  "C3",
  "F2",
  "G2",
  "G2",
  "G2",
  "F2",
  "G2",
  "A#2",
  "G2",
];

interface SequencerProps {
  erebus: Erebus;
  sendCVs: (cv1: string, cv2: string) => void;
}

declare global {
  interface Window {
    sequencer: {
      steps: string[];
      currentStep: number;
      gateLength: number;
      tempo: number;
    };
  }
}

window.sequencer = { currentStep: 0, steps: [], gateLength: 50, tempo: 120 };

export default function Sequencer({
  erebus,
  sendCVs,
}: SequencerProps): JSX.Element {
  const classes = useStyles();
  const [tempo, setTempo] = useState<number>(120);
  const [gate, setGate] = useState<number>(50);
  const [sequence, setSequence] = useState<Tone.Sequence | null>(null);
  const [sequencerNotes, setSequencerNotes] =
    useState<string[]>(defaultSequence);
  const [activeStep, setActiveStep] = useState<number>(-1);

  const trigger = (time: number | undefined, note: string) => {
    sendCVs(note, note);

    const gateLength =
      (1 / (window.sequencer.tempo / 60)) * (window.sequencer.gateLength / 100);

    if (time === undefined) {
      // play note immediately
      erebus.vca.ampEnv.triggerAttackRelease(gateLength, undefined, 1.0);
      erebus.envelope.envelope.triggerAttackRelease(gateLength, undefined, 1.0);
      return;
    }

    // schedule note to be played at time
    erebus.vca.ampEnv.triggerAttack(time, 1.0);
    erebus.envelope.envelope.triggerAttack(time, 1.0);

    erebus.vca.ampEnv.triggerRelease(time + gateLength);
    erebus.envelope.envelope.triggerRelease(time + gateLength);

    // update UI LED
    if (window.sequencer.currentStep < sequencerNotes.length - 1) {
      setActiveStep(window.sequencer.currentStep + 1);
      window.sequencer.currentStep += 1;
    } else {
      setActiveStep(0);
      window.sequencer.currentStep = 0;
    }
  };

  const changeSequenceAtIndex = (index: number) => (input: number) => {
    const newNoteValue = Math.round(input);
    const newNote = allSequencerNotes[newNoteValue];

    sequencerNotes[index] = newNote;
    setSequencerNotes([...sequencerNotes]);

    // stop playback to reduce audio glitches
    Tone.Transport.stop();
    sequence?.stop();

    // makes it easier to dial in notes by playing them while changing pitch
    trigger(undefined, newNote);
  };

  useEffect(() => {
    const newLoop = new Tone.Sequence(trigger, sequencerNotes, "8n");
    setSequence(newLoop);
    window.sequencer = {
      currentStep: 0,
      steps: sequencerNotes,
      gateLength: gate,
      tempo,
    };

    return () => {
      Tone.Transport.stop();
      sequence?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startLoop = () => {
    if (!sequence) {
      return;
    }
    Tone.context.lookAhead = 0.003;
    Tone.Transport.start();
    sequence.start(0);
  };

  const stopLoop = () => {
    if (!sequence) {
      return;
    }
    Tone.context.lookAhead = 0.003;
    Tone.Transport.stop();
    sequence.stop();

    // reset UI LED
    setActiveStep(-1);
  };

  useEffect(() => {
    Tone.Transport.bpm.rampTo(tempo);
    window.sequencer.tempo = tempo;
  }, [tempo]);

  // useEffect(() => {
  //   if (!sequence) {
  //     return;
  //   }
  //   // inject current state into tone.sequence callback function
  //   sequence.set({ callback: trigger(gate, activeStep) });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [gate, activeStep]);

  useEffect(() => {
    if (!sequence) {
      return;
    }
    sequence.events = sequencerNotes;
    setActiveStep(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sequencerNotes]);

  return (
    <div className={classes.plate} title={sequencerDescription}>
      <p className={classes.headerText}>Sequencer</p>
      <div className={classes.row}>
        <div className={classnames(classes.row, classes.tempoPlate)}>
          <SequencerKnob
            label="tempo"
            value={tempo}
            onChange={(input: number) => {
              setTempo(Math.floor(input));
            }}
            min={33}
            max={300}
            initial={162}
            name="erebus-knobs-sequencer-tempo"
          />
          <SequencerKnob
            label="gate"
            value={gate}
            onChange={(input: number) => {
              setGate(Math.floor(input));
              window.sequencer.gateLength = Math.floor(input);
            }}
            min={1}
            max={100}
            initial={27}
            name="erebus-knobs-sequencer-gate"
          />

          <SequencerButton onClick={startLoop}>start</SequencerButton>
          <SequencerButton onClick={stopLoop}>stop</SequencerButton>
        </div>
      </div>
      <div className={classnames(classes.row, classes.sequence)}>
        {sequencerNotes.map((_note, index) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div
              key={`step-${index}`}
              className={classnames(classes.column, classes.padded)}
            >
              <Led on={index === activeStep} />
              <Knob
                isLinear
                min={0}
                max={24}
                initial={allSequencerNotes.findIndex(
                  (val) => val === sequencerNotes[index]
                )}
                onChange={changeSequenceAtIndex(index)}
                name={`erebus-knobs-sequencer-${index}`}
              />
              <p className={classes.noteText}>{sequencerNotes[index]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
