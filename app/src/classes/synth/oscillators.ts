import * as Tone from "tone";
import Oscillator from "./oscillator";

export default class Oscillators {
  osc1: Oscillator;

  osc2: Oscillator;

  setOscMix: (input: number) => void;

  output: Tone.CrossFade;

  constructor() {
    this.osc1 = new Oscillator("pulse", ["sawtooth", "pulse"], "C1");
    this.osc2 = new Oscillator("sawtooth", ["sawtooth", "triangle"], "C2");

    this.output = new Tone.CrossFade(0.5);

    this.osc1.oscillator.connect(this.output.a);
    this.osc2.oscillator.connect(this.output.b);

    this.setOscMix = (input: number) => {
      this.output.fade.value = input / 100;
    };
  }
}
