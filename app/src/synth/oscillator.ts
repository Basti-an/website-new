import * as Tone from "tone";
import { OmniOscillatorType } from "tone/build/esm/source/oscillator/OscillatorInterface";
import { ModSource } from "../types/modSource.d";

export default class Oscillator {
  oscillator: Tone.OmniOscillator<Tone.Oscillator>;

  inputs: { frequency: (input: ModSource) => void };

  glide: number;

  frequency: Tone.Signal<"frequency">;

  waveform: OmniOscillatorType;

  possibleWaveforms: OmniOscillatorType[];

  constructor(
    waveform: OmniOscillatorType,
    possibleWaveforms: OmniOscillatorType[],
    note?: string,
  ) {
    this.oscillator = new Tone.OmniOscillator(note ?? "C1", waveform ?? "sawtooth");
    this.frequency = new Tone.Signal(0, "frequency");
    this.waveform = waveform;
    this.possibleWaveforms = possibleWaveforms;

    const oscFreqConnect = new Tone.Add();
    this.frequency.connect(oscFreqConnect.addend);
    oscFreqConnect.connect(this.oscillator.frequency);

    this.inputs = {
      frequency: (input: ModSource) => input.connect(oscFreqConnect),
    };

    this.glide = 0;

    this.oscillator.start();
  }
}
