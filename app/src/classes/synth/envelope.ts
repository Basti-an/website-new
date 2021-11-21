import * as Tone from "tone";

export default class Envelope {
  envelope: Tone.Envelope;

  output: Tone.Scale;

  filterOutput: Tone.Scale;

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

    this.filterOutput = new Tone.Scale(0, 1);
    this.envelope.connect(this.filterOutput);

    this.output = new Tone.Scale(0, initialMax ?? 0.8);
    this.envelope.connect(this.output);
  }
}
