import * as Tone from "tone";

export default class Envelope {
  envelope: Tone.Envelope;

  output: Tone.Scale;

  filterOutput: Tone.Scale;

  // @TODO: implement a second stage scaler, so that ui can set values between [0,1]
  // while output gets scaled for the appropriate input, eg. vca volume, filter freq, etc.

  setMaxOutput: (input: number) => void = (max: number) => {
    this.filterOutput.set({ max });
  };

  constructor(a?: number, d?: number, s?: number, r?: number, initialMax?: number) {
    this.envelope = new Tone.Envelope({
      attack: a ?? 0,
      decay: d ?? 0.33,
      sustain: s ?? 0.8,
      release: r ?? 2,
    });
    this.output = new Tone.Scale(0, initialMax ?? 0.8);
    this.filterOutput = new Tone.Scale(0, 1);
    this.envelope.connect(this.output);
    this.envelope.connect(this.filterOutput);
  }
}
