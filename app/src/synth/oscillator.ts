import * as Tone from "tone";
import { InputNode, PulseOscillator } from "tone";
import { OmniOscillatorType } from "tone/build/esm/source/oscillator/OscillatorInterface";
import { ModSource } from "../types/modSource.d";

export default class Oscillator {
  oscillator: Tone.OmniOscillator<Tone.Oscillator>;

  inputs: { frequency: (input: ModSource) => void; pulsewidth: (input: ModSource) => void };

  glide: number;

  frequency: Tone.Signal<"frequency">;

  possibleWaveforms: OmniOscillatorType[];

  setWaveform: (wtf: OmniOscillatorType) => void;

  private pulsewidthInputScaler: Tone.Scale;

  private dummyScaler: Tone.Scale;

  constructor(waveform: OmniOscillatorType, possibleWaveforms: OmniOscillatorType[], note = "C1") {
    this.oscillator = new Tone.OmniOscillator(note, waveform);
    this.frequency = new Tone.Signal(0, "frequency");
    this.pulsewidthInputScaler = new Tone.Scale(0.2, 1.0);
    this.dummyScaler = new Tone.Scale(0.2, 1.0);

    this.setWaveform = (type: OmniOscillatorType) => {
      this.oscillator.type = type;
      const osc = (this.oscillator as unknown) as PulseOscillator; // i'm so sorry
      if (type === "pulse") {
        this.pulsewidthInputScaler.connect(osc.width);
      } else {
        this.pulsewidthInputScaler.disconnect();
        this.pulsewidthInputScaler.connect(this.dummyScaler);
      }
    };
    this.possibleWaveforms = possibleWaveforms;

    const oscFreqConnect = new Tone.Add();
    this.frequency.connect(oscFreqConnect.addend);
    oscFreqConnect.connect(this.oscillator.frequency);

    this.inputs = {
      frequency: (input: ModSource) => input.connect(oscFreqConnect),
      pulsewidth: (input: ModSource) => input.connect(this.pulsewidthInputScaler),
    };

    this.glide = 0;

    this.oscillator.start();
  }
}
