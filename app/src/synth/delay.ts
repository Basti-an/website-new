import * as Tone from "tone";
import { ModSource } from "../types/modSource.d";

export default class Delay {
  delay: Tone.FeedbackDelay;

  inputs: { delayTime: (input: ModSource) => void };

  private inputSignal: Tone.Signal<"number">;

  constructor(delayTime?: number, feedback?: number) {
    this.delay = new Tone.FeedbackDelay(delayTime ?? 0.4, feedback ?? 0.3);

    this.inputSignal = new Tone.Signal(0, "number");

    // setup delay to accept modulation sources
    const delayConnect = new Tone.Add();
    this.inputSignal.connect(delayConnect.addend);
    delayConnect.connect(this.delay.delayTime);

    this.inputs = { delayTime: (input: ModSource) => input.connect(this.inputSignal) };
  }
}
