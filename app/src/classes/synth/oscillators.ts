import * as Tone from "tone";
import Oscillator from "./oscillator";

export default class Oscillators {
  osc1: Oscillator;

  osc2: Oscillator;

  setOscMix: (input: number) => void;

  crossfade: Tone.CrossFade;

  output: Tone.Gain;

  constructor() {
    this.osc1 = new Oscillator("pulse", ["sawtooth", "pulse"], "C1");
    this.osc2 = new Oscillator("sawtooth", ["sawtooth", "triangle"], "C2");

    this.crossfade = new Tone.CrossFade(0.5);
    this.output = new Tone.Gain(0.666);

    this.osc1.oscillator.connect(this.crossfade.a);
    this.osc2.oscillator.connect(this.crossfade.b);

    this.crossfade.connect(this.output);

    this.setOscMix = (input: number) => {
      this.crossfade.fade.value = input / 100;
    };
  }
}
