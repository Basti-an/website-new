import classnames from "classnames";
import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import { sequencerStyles } from "../../jss/synth";
import Erebus from "../../synth/erebus";
import { allSequencerNotes } from "../../utils";

import Knob from "../synth/knob";
import { Led } from "../synth/led";
import { SequencerButton } from "../synth/sequencerButton";
import { SequencerKnob } from "../synth/sequencerKnob";

const useStyles = sequencerStyles;

const sequencerDescription = "";

const defaultSequence = [
  // bass sequence for Giorgio Moroders "chase"
  "A#1",
  "C2",
  "C2",
  "C2",
  "A#1",
  "C2",
  "D#2",
  "C2",
  "F1",
  "G1",
  "G1",
  "G1",
  "F1",
  "G1",
  "A#1",
  "G1",
];

interface SequencerProps {
  erebus: Erebus;
  sendCVs: (cv1: string, cv2: string) => void;
}

export default function Sequencer({ erebus, sendCVs }: SequencerProps): JSX.Element {
  const classes = useStyles();
  const [tempo, setTempo] = useState<number>(120);
  const [gate, setGate] = useState<number>(50);
  const [sequence, setSequence] = useState<Tone.Sequence | null>(null);
  const [sequencerNotes, setSequencerNotes] = useState<string[]>(defaultSequence);
  const [activeStep, setActiveStep] = useState<number>(-1);

  const trigger = (gateValue: number, step: number) => (time: number | undefined, note: string) => {
    sendCVs(note, note);

    const gateLength = (1 / (tempo / 60)) * (gateValue / 100);

    if (time === undefined) {
      // play note immediately
      erebus.ampEnv.triggerAttackRelease(gateLength, undefined, 1.0);
      erebus.envelope.envelope.triggerAttackRelease(gateLength, undefined, 1.0);
      return;
    }

    // schedule note to be played at time
    erebus.ampEnv.triggerAttack(time, 1.0);
    erebus.envelope.envelope.triggerAttack(time, 1.0);

    erebus.ampEnv.triggerRelease(time + gateLength);
    erebus.envelope.envelope.triggerRelease(time + gateLength);

    // update UI LED
    if (step < sequencerNotes.length - 1) {
      setActiveStep(step + 1);
    } else {
      setActiveStep(0);
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
    trigger(50, -1)(undefined, newNote);
  };

  useEffect(() => {
    const newLoop = new Tone.Sequence(trigger(gate, activeStep), sequencerNotes, "8n");
    setSequence(newLoop);

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

    Tone.Transport.start();
    sequence.start(0);
  };

  const stopLoop = () => {
    if (!sequence) {
      return;
    }

    Tone.Transport.stop();
    sequence.stop();

    // reset UI LED
    setActiveStep(-1);
  };

  useEffect(() => {
    Tone.Transport.bpm.rampTo(tempo);
  }, [tempo]);

  useEffect(() => {
    if (!sequence) {
      return;
    }
    // inject current state into tone.sequence callback function
    sequence.set({ callback: trigger(gate, activeStep) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gate, activeStep]);

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
          />
          <SequencerKnob
            label="gate"
            value={gate}
            onChange={(input: number) => {
              setGate(Math.floor(input));
            }}
            min={1}
            max={100}
            initial={27}
          />

          <SequencerButton onClick={startLoop}>start</SequencerButton>
          <SequencerButton onClick={stopLoop}>stop</SequencerButton>
        </div>
      </div>
      <div className={classnames(classes.row, classes.sequence)}>
        {sequencerNotes.map((note, index) => {
          return (
            <div className={classnames(classes.column, classes.padded)}>
              <Led on={index === activeStep} />
              <Knob
                isLinear
                minVal={0}
                maxVal={24}
                initialValue={allSequencerNotes.findIndex((val) => val === sequencerNotes[index])}
                changeInput={changeSequenceAtIndex(index)}
              />
              <p className={classes.noteText}>{sequencerNotes[index]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
