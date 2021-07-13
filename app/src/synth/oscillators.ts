import * as Tone from "tone";
import { getLogValue } from "../utils";
import Oscillator from "./oscillator";

export default class Oscillators {
  osc1: Oscillator;

  osc2: Oscillator;

  setOscMix: (input: number) => void;

  oscMixOut: Tone.Limiter;

  private osc1Volume: Tone.Volume;

  private osc2Volume: Tone.Volume;

  constructor() {
    this.osc1 = new Oscillator("square", ["sawtooth", "pulse"], "C1");
    this.osc2 = new Oscillator("sawtooth", ["sawtooth", "triangle"], "C2");

    this.oscMixOut = new Tone.Limiter(-12);

    this.osc1Volume = new Tone.Volume(-15);
    this.osc2Volume = new Tone.Volume(-15);
    this.osc1.oscillator.connect(this.osc1Volume);
    this.osc2.oscillator.connect(this.osc2Volume);
    this.osc1Volume.connect(this.oscMixOut);
    this.osc2Volume.connect(this.oscMixOut);

    this.setOscMix = (input: number) => {
      // @TODO: find a better solution than this

      // translate input between 0-100 into decibel mix of 2 oscillators,
      // where 0 translates to osc1 at 100% & osc2 at 0 and
      // 100 translates to osc1 at 0% & osc2 at 100% volumes
      const percentageOsc1 = 100 - input;
      const percentageOsc2 = input;
      const decibelsOsc1 =
        percentageOsc1 < 1 ? -Infinity : getLogValue(100 - percentageOsc1, 12, 24) * -1;
      const decibelsOsc2 =
        percentageOsc2 < 1 ? -Infinity : getLogValue(100 - percentageOsc2, 12, 24) * -1;

      this.osc1Volume.set({ volume: decibelsOsc1 });
      this.osc2Volume.set({ volume: decibelsOsc2 });
    };
  }
}
