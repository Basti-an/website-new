import * as Tone from "tone";
import { PulseOscillator } from "tone";
import { OmniOscillatorType } from "tone/build/esm/source/oscillator/OscillatorInterface";
import { ModSource } from "../types/modSource.d";

export default class Oscillator {
  oscillator: Tone.OmniOscillator<Tone.Oscillator>;

  inputs: { frequency: (input: ModSource) => void; pulsewidth: (input: ModSource) => void };

  glide: number;

  frequency: Tone.Signal<"frequency">;

  detune: Tone.Signal<"cents">;

  possibleWaveforms: OmniOscillatorType[];

  setWaveform: (waveform: OmniOscillatorType) => void;

  private pulsewidthInputScale: Tone.Scale;

  private frequencyInputScale: Tone.Scale;

  private dummyScaler: Tone.Scale;

  constructor(waveform: OmniOscillatorType, possibleWaveforms: OmniOscillatorType[], note = "C1") {
    this.oscillator = new Tone.OmniOscillator(note, waveform);
    this.frequency = new Tone.Signal(0, "frequency");
    this.detune = new Tone.Signal(0, "cents");
    this.pulsewidthInputScale = new Tone.Scale(0.1, 1.0);
    this.dummyScaler = new Tone.Scale(0.2, 1.0);

    this.setWaveform = (type: OmniOscillatorType) => {
      this.oscillator.type = type;
      const osc = (this.oscillator as unknown) as PulseOscillator; // i'm so sorry
      if (type === "pulse") {
        this.pulsewidthInputScale.connect(osc.width);
      } else {
        this.pulsewidthInputScale.disconnect();
        this.pulsewidthInputScale.connect(this.dummyScaler);
      }
    };
    this.possibleWaveforms = possibleWaveforms;

    const oscFreqConnect = new Tone.Add();
    this.frequency.connect(oscFreqConnect.addend);
    oscFreqConnect.connect(this.oscillator.frequency);

    const oscDetuneConnect = new Tone.Add();
    this.detune.connect(oscDetuneConnect.addend);
    oscDetuneConnect.connect(this.oscillator.detune);
    this.frequencyInputScale = new Tone.ScaleExp(0, 5000, 2.71);
    this.frequencyInputScale.connect(oscDetuneConnect);

    this.inputs = {
      frequency: (input: ModSource) => input.connect(this.frequencyInputScale),
      pulsewidth: (input: ModSource) => input.connect(this.pulsewidthInputScale),
    };

    this.glide = 0;

    this.oscillator.start();
  }
}
