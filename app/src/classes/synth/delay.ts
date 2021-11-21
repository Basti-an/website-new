import * as Tone from "tone";
import { Scale, ScaleOptions } from "tone";
import { SynthInputs } from "../../types/synthinputs";

export default class Delay {
  delay: Tone.FeedbackDelay;

  inputs: SynthInputs;

  private inputSignal: Tone.Scale;

  constructor(delayTime?: number, feedback?: number) {
    this.delay = new Tone.FeedbackDelay(delayTime ?? 0.4, feedback ?? 0.3);

    // setup delay to accept modulation sources
    const delayConnect = new Tone.Add();
    this.inputSignal = new Tone.Scale(0, 1);
    this.inputSignal.connect(delayConnect.addend);
    delayConnect.connect(this.delay.delayTime);

    this.inputs = {
      delay: (input: Scale<ScaleOptions>) => input.connect(this.inputSignal),
    };
  }
}
