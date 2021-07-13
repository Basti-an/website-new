import * as Tone from "tone";

export default class LFO {
  lfo: Tone.LFO;

  constructor(frequency?: number, min?: number, max?: number) {
    this.lfo = new Tone.LFO(frequency ?? 0.7, min ?? -1800, max ?? 1800);
    this.lfo.set({ units: "cents" });
    this.lfo.start();
  }
}
