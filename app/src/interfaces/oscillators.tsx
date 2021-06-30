import * as Tone from "tone";
import { Signal } from "tone";
import { OmniOscillatorType } from "tone/build/esm/source/oscillator/OscillatorInterface";
import { ModSource } from "../types/modSource.d";

export interface IOscillators {
  osc1: {
    oscillator: Tone.OmniOscillator<Tone.Oscillator>;
    volume: Tone.Volume;
    glide: number;
    waveform: OmniOscillatorType;
    possibleWaveforms: string[];
    frequency: Signal<"frequency">;
  };
  osc2: {
    oscillator: Tone.OmniOscillator<Tone.Oscillator>;
    volume: Tone.Volume;
    glide: number;
    waveform: OmniOscillatorType;
    possibleWaveforms: string[];
    frequency: Signal<"frequency">;
    detune: number;
  };
  oscMixOut: Tone.Limiter;
  setOscMix: (input: number) => void;
  inputs: {
    freqOsc1: (input: ModSource) => void;
    freqOsc2: (input: ModSource) => void;
  };
}
