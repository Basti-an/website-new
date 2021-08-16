import * as Tone from "tone";

export default class LFO {
  lfo: Tone.LFO;

  output: Tone.Scale;

  constructor(frequency?: number, min?: number, max?: number) {
    this.lfo = new Tone.LFO(frequency ?? 0.7, min ?? 0, max ?? 1);
    this.lfo.set({ units: "cents" });
    this.lfo.start();
    this.output = new Tone.Scale(0, 1);
    this.lfo.connect(this.output);
  }
}
