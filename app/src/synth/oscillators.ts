import * as Tone from "tone";
import Oscillator from "./oscillator";

export default class Oscillators {
  osc1: Oscillator;

  osc2: Oscillator;

  setOscMix: (input: number) => void;

  oscMixOut: Tone.Limiter;

  private osc1Volume: Tone.Gain;

  private osc2Volume: Tone.Gain;

  constructor() {
    this.osc1 = new Oscillator("pulse", ["sawtooth", "pulse"], "C1");
    this.osc2 = new Oscillator("sawtooth", ["sawtooth", "triangle"], "C2");

    this.oscMixOut = new Tone.Limiter(-12);

    this.osc1Volume = new Tone.Gain(0.9);
    this.osc2Volume = new Tone.Gain(0.9);
    this.osc1.oscillator.connect(this.osc1Volume);
    this.osc2.oscillator.connect(this.osc2Volume);
    this.osc1Volume.connect(this.oscMixOut);
    this.osc2Volume.connect(this.oscMixOut);

    // pulsewidth modulation input

    this.setOscMix = (input: number) => {
      // translate input between 0-100 into gain mix of 2 oscillators,
      // where 0 translates to osc1 at 100% & osc2 at 0 and
      // 100 translates to osc1 at 0% & osc2 at 100% volumes
      // 50 translates to 100% at boths osc´s
      const percentageOsc1 = 100 - input > 50 ? 0.8 : (100 - input) / 50;
      const percentageOsc2 = input > 50 ? 0.8 : input / 50;

      this.osc1Volume.set({ gain: percentageOsc1 });
      this.osc2Volume.set({ gain: percentageOsc2 });
    };
  }
}
